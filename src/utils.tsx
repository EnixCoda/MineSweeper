export function formatTime(time: number, padTo = 0) {
  return (
    Math.min(999, time / 1000)
      .toFixed(1)
      .padStart(padTo, "0") + "s"
  );
}
