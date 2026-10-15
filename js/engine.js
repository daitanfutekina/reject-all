import { seededRandom, shuffle } from './random.js';

// Multipliers are relative to the original v1 base durations.
export const CURVE = Object.freeze({ start: 1.4, winsPerStep: 6, step: 0.05, floor: 0.55, bossFloor: 0.8, firstEncounter: 1.5, relaxed: 1.75, tier2: 3, tier3: 5 });

export const tierFor = difficulty => difficulty >= CURVE.tier3 ? 3 : difficulty >= CURVE.tier2 ? 2 : 1;

export function durationFor(baseDuration, level, relaxed = false, boss = false, { firstEncounter = false, minDuration = 0 } = {}) {
  const minimum = boss ? CURVE.bossFloor : CURVE.floor;
  const normal = Math.round(Math.max(minDuration, baseDuration * Math.max(minimum, CURVE.start - (level - 1) * CURVE.step)));
  return Math.round(normal * (firstEncounter ? CURVE.firstEncounter : 1) * (relaxed ? CURVE.relaxed : 1));
}

export class Run {
  constructor(seed, ids) {
    this.seed = String(seed);
    this.ids = [...ids];
    this.rng = seededRandom(seed);
    this.bag = [];
    this.previous = null;
    this.current = null;
    this.lives = 4;
    this.score = 0;
    this.played = 0;
    this.cleared = 0;
    this.bossDue = false;
  }
  get level() { return 1 + Math.floor(this.cleared / CURVE.winsPerStep); }
  get over() { return this.lives === 0; }
  next() {
    if (this.over) return null;
    if (this.current) return this.current;
    let id;
    if (this.bossDue) {
      id = 'gym';
    } else {
      if (!this.bag.length) {
        this.bag = shuffle(this.rng, this.ids);
        if (this.bag.length > 1 && this.bag.at(-1) === this.previous) {
          [this.bag[0], this.bag[this.bag.length - 1]] = [this.bag.at(-1), this.bag[0]];
        }
      }
      id = this.bag.pop();
      this.previous = id;
    }
    this.current = { id, seed: `${this.seed}:${this.played}:${Math.floor(this.rng() * 1e9)}`, difficulty: this.level };
    return this.current;
  }
  resolve(won) {
    if (!this.current || this.over) return false;
    const boss = this.current.id === 'gym';
    if (won) {
      this.score += boss ? 5 : 1;
      if (boss) this.lives = Math.min(4, this.lives + 1);
      else this.cleared++;
    } else this.lives--;
    if (boss) this.bossDue = false;
    else {
      this.played++;
      this.bossDue = this.played % 10 === 0;
    }
    this.current = null;
    return true;
  }
}

// All phases use this clock; games never start their own timeouts.
export class PhaseClock {
  constructor() { this.remaining = 0; this.paused = false; this.last = null; }
  start(duration, now) { this.remaining = duration; this.last = now; }
  advance(now) {
    if (this.last !== null && !this.paused) this.remaining = Math.max(0, this.remaining - Math.max(0, now - this.last));
    this.last = now;
    return this.remaining;
  }
  setPaused(paused, now) { this.advance(now); this.paused = paused; }
}
