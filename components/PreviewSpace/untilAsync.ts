export function untilAsync(
  fn: () => any,
  predicate: () => boolean,
  interval: number
) {
  const intv = setInterval(() => {
    fn();

    if (predicate()) {
      clearInterval(intv);
    }
  }, interval);
}
