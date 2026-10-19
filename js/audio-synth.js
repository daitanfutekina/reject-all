import { midiHz, CUES } from './audio-score.js';

const smooth = (parameter, value, time, seconds = 0.025) => {
  parameter.cancelScheduledValues(time);
  parameter.setTargetAtTime(value, time, seconds);
};

// A shared instrument rack for real-time playback and offline audio verification.
export function createRack(context) {
  const sources = new Set();
  const master = context.createGain(), music = context.createGain(), effects = context.createGain();
  const duck = context.createGain(), compressor = context.createDynamicsCompressor();
  master.gain.value = 0.7; music.gain.value = 0; effects.gain.value = 0;
  compressor.threshold.value = -12; compressor.knee.value = 8;
  compressor.ratio.value = 4; compressor.attack.value = 0.003; compressor.release.value = 0.08;
  music.connect(duck).connect(master); effects.connect(master);
  const outputLevel = context.createGain(); outputLevel.gain.value = 1.1;
  master.connect(compressor).connect(outputLevel).connect(context.destination);
  // A band-limited 25% pulse; shared by every short arcade lead and cue.
  const real = new Float32Array(33), imaginary = new Float32Array(33);
  for (let harmonic = 1; harmonic < real.length; harmonic++) real[harmonic] = 2 * Math.sin(Math.PI * harmonic * 0.25) / (Math.PI * harmonic);
  const pulse = context.createPeriodicWave(real, imaginary);
  const noise = context.createBuffer(1, context.sampleRate, context.sampleRate);
  let seed = 4729;
  for (let i = 0; i < noise.length; i++) { seed = (seed * 1664525 + 1013904223) >>> 0; noise.getChannelData(0)[i] = seed / 2147483648 - 1; }

  function note(voice, midi, time, duration, velocity = 0.4, pan = 0, bus = 'music') {
    time = Math.max(context.currentTime, time);
    const output = context.createGain(), position = context.createStereoPanner();
    position.pan.value = pan; output.connect(position).connect(bus === 'music' ? music : effects);
    const nodes = [output, position];
    const pitched = !['kick', 'snare', 'clap', 'hat', 'shaker', 'rim', 'tom'].includes(voice);
    let end = duration, pending = 0;
    const add = (source, target, length) => {
      pending++; sources.add(source); source.connect(target);
      source.onended = () => { sources.delete(source); source.disconnect(); if (--pending === 0) nodes.forEach(node => node.disconnect()); };
      source.start(time); source.stop(time + length);
    };
    const envelope = (gain, peak, attack, decay, length) => {
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(peak, time + attack);
      gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, peak * decay), time + length * 0.7);
      gain.gain.linearRampToValueAtTime(0, time + length);
    };
    const oscillator = (type, frequency, gain, length = end, detune = 0) => {
      const source = context.createOscillator();
      if (type === 'pulse') source.setPeriodicWave(pulse); else source.type = type;
      source.frequency.value = frequency; source.detune.value = detune; add(source, gain, length); return source;
    };
    if (pitched) {
      const frequency = midiHz(midi);
      if (voice === 'bass') {
        const filter = context.createBiquadFilter(); nodes.push(filter);
        filter.type = 'lowpass'; filter.frequency.setValueAtTime(1800, time);
        filter.frequency.exponentialRampToValueAtTime(420, time + Math.max(0.025, duration));
        filter.Q.value = 0.65; filter.connect(output);
        end = duration + 0.025;
        envelope(output, velocity * 0.44, 0.003, 0.18, end);
        oscillator('square', frequency, filter, end);
      } else if (['brass', 'pulse', 'chip', 'zap', 'keys', 'pluck', 'pad'].includes(voice)) {
        const brass = voice === 'brass', zap = voice === 'zap';
        end = Math.min(duration, 0.22) + 0.018;
        const filter = context.createBiquadFilter(); nodes.push(filter);
        filter.type = 'lowpass'; filter.Q.value = 0.55;
        filter.frequency.setValueAtTime(brass ? 3800 : 3000, time);
        filter.frequency.exponentialRampToValueAtTime(brass ? 1400 : 1800, time + end);
        filter.connect(output);
        envelope(output, velocity * (brass ? 0.48 : 0.38), 0.003, brass ? 0.3 : 0.16, end);
        const source = oscillator(brass ? 'sawtooth' : voice === 'chip' ? 'square' : 'pulse', frequency, filter, end);
        if (brass) {
          const body = context.createGain(); nodes.push(body); body.gain.value = 0.25; body.connect(filter);
          oscillator('square', frequency, body, end);
        }
        if (zap) source.frequency.exponentialRampToValueAtTime(frequency * 0.35, time + end);
      } else {
        const bell = voice === 'bell', wood = voice === 'wood';
        end = duration + (bell ? 0.06 : 0.015);
        envelope(output, velocity * (wood ? 0.45 : 0.3), 0.003, 0.025, end);
        oscillator('sine', frequency, output, end);
        const harmonic = context.createGain(); nodes.push(harmonic); harmonic.gain.value = wood ? 0.35 : bell ? 0.22 : 0.3;
        harmonic.connect(output); oscillator('sine', frequency * (wood ? 2.73 : bell ? 3 : 2), harmonic, end);
      }
    } else if (voice === 'kick' || voice === 'tom') {
      end = voice === 'kick' ? 0.15 : 0.11;
      envelope(output, velocity * 0.85, 0.002, 0.035, end);
      const source = oscillator('sine', voice === 'kick' ? 190 : midiHz(midi), output, end);
      source.frequency.exponentialRampToValueAtTime(voice === 'kick' ? 48 : midiHz(midi) * 0.55, time + end * 0.45);
    } else {
      end = ['snare', 'clap'].includes(voice) ? 0.105 : voice === 'shaker' ? 0.032 : 0.035;
      const filter = context.createBiquadFilter(); nodes.push(filter);
      filter.type = voice === 'snare' || voice === 'clap' ? 'bandpass' : 'highpass';
      filter.frequency.value = voice === 'snare' ? 2300 : voice === 'clap' ? 1600 : 5800;
      filter.Q.value = 0.65; filter.connect(output);
      const source = context.createBufferSource(); source.buffer = noise;
      envelope(output, velocity * (voice === 'hat' ? 0.27 : 0.65), 0.001, 0.02, end);
      if (voice === 'clap') {
        for (const offset of [0.012, 0.025]) { output.gain.setValueAtTime(velocity * 0.4, time + offset); output.gain.exponentialRampToValueAtTime(0.001, time + offset + 0.011); }
      }
      add(source, filter, end);
      if (voice === 'snare' || voice === 'rim') {
        const body = context.createGain(); nodes.push(body); body.gain.value = 0.45; body.connect(output);
        oscillator('triangle', voice === 'rim' ? 950 : 210, body, end);
      }
    }
  }

  return {
    note,
    volumes(musicLevel, effectsLevel) {
      smooth(music.gain, musicLevel * 0.8, context.currentTime);
      smooth(effects.gain, effectsLevel, context.currentTime);
    },
    duck(amount = 0.45, duration = 0.35) {
      const time = context.currentTime;
      duck.gain.cancelScheduledValues(time); duck.gain.setTargetAtTime(amount, time, 0.012);
      duck.gain.setTargetAtTime(1, time + duration, 0.1);
    },
    cue(name, time = context.currentTime, transpose = 0) {
      for (const [voice, midi, offset, length, velocity] of CUES[name] || []) note(voice, midi + transpose, time + offset, length, velocity, 0, 'effects');
    },
    stop() {
      for (const source of sources) { source.onended = null; try { source.stop(); } catch { /* A source may have just ended. */ } source.disconnect(); }
      sources.clear();
      [music, effects, master, duck, compressor, outputLevel].forEach(node => node.disconnect());
    },
    get activeSources() { return sources.size; },
  };
}
