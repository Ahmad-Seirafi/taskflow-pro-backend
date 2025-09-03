export function msToMillis(expr: string): number {
  const m = expr.match(/^(\d+)([smhd])$/);
  if (!m) throw new Error('Invalid time expression: ' + expr);
  const n = Number(m[1]);
  const u = m[2];
  switch (u) {
    case 's': return n * 1000;
    case 'm': return n * 60_000;
    case 'h': return n * 3_600_000;
    case 'd': return n * 86_400_000;
    default: throw new Error('Unsupported unit: ' + u);
  }
}
