import { seededRandom, shuffle } from './random.js';

export function durationFor(baseDuration, level, relaxed = false, boss = false) {
  const minimum = boss ? 0.8 : 0.55;
  return Math.round(baseDuration * Math.max(minimum, 1 - (level - 1) * 0.08) * (relaxed ? 1.75 : 1));
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
  get level() { return 1 + Math.floor(this.cleared / 4); }
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
