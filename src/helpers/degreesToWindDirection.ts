export function degreesToWindDirection(degrees: number): string {
  const quarter = 45;
  const normalizedDegrees = ((degrees % 360) + 360) % 360;
  const directions = ['N ↑', 'NE ↗', 'E →', 'SE ↘', 'S ↓', 'SW ↙', 'W ←', 'NW ↖'];
  const directionIndex = Math.round(normalizedDegrees / quarter) % directions.length;

  return directions[directionIndex] ?? 'N';
}
