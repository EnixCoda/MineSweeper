export function formatTime(time: number) {
  return Math.min(999, time / 1000)
    .toFixed(1)
    .padStart(5, "0");
}
