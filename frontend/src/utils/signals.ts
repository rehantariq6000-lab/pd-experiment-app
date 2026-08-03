// Helpers for the live recording charts (values kept in 0..1).

export function clamp(v: number) {
  return Math.max(0, Math.min(1, v));
}

export function seed(n: number, base: number): number[] {
  return Array.from({ length: n }, (_, i) => clamp(base + 0.25 * Math.sin(i / 3)));
}

export function roll(arr: number[], next: number): number[] {
  return [...arr.slice(1), clamp(next)];
}
