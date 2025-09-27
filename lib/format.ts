export function pct(v: number | null | undefined, digits = 1): string {
  if (v == null || Number.isNaN(v)) return "—";
  return `${(v * 100).toFixed(digits)}%`;
}

export function cents(v: number | null | undefined, digits = 2): string {
  if (v == null || !Number.isFinite(v)) return "—";
  return `${v.toFixed(digits)}¢`;
}

export function humanTokens(v: number | null | undefined): string {
  if (v == null || !Number.isFinite(v)) return "—";
  if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(2)}B`;
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(2)}k`;
  return `${v}`;
}

export function buildLogTicks(minExp: number, maxExp: number): number[] {
  const ticks: number[] = [];
  for (let e = Math.floor(minExp); e <= Math.ceil(maxExp); e++) {
    ticks.push(e);
  }
  return ticks;
}