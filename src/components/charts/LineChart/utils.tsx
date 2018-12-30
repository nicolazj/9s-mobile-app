export function getTicks(min: number, max: number, count: number, precise = 1) {
  const step = (max - min) / (count - 1);
  const ticks = [];
  let i = 0;
  while (i < count) {
    ticks[i] = (min + step * i).toFixed(precise);
    i++;
  }
  return ticks.map(Number);
}
