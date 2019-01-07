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

export function getDomain(arr: [number, number]) {
  const spacer = 1;
  let [a, b] = arr;
  return a === b ? [a - spacer, b + spacer] : [a, b];
}
