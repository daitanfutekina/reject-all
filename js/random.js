// FNV-1a seed hashing followed by Mulberry32. No ambient randomness in a round.
export function seededRandom(seed) {
  let state = 2166136261;
  for (const character of String(seed)) state = Math.imul(state ^ character.charCodeAt(0), 16777619);
  return () => {
    state += 0x6D2B79F5;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export const integer = (rng, min, max) => min + Math.floor(rng() * (max - min + 1));
export const pick = (rng, values) => values[integer(rng, 0, values.length - 1)];
export function shuffle(rng, values) {
  const result = [...values];
  for (let i = result.length - 1; i > 0; i--) {
    const j = integer(rng, 0, i);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
