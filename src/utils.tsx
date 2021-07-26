export function formatTime(time: number, padTo = 0) {
  return (
    Math.min(999, time / 1000)
      .toFixed(0)
      .padStart(padTo, "0") + "s"
  );
}

export function customDiff<Props>(
  prevProps: Props,
  nextProps: Props,
  rules: {
    [key in keyof Props]?: (prev: Props[key], next: Props[key]) => boolean;
  }
) {
  const dummyPropsWithAllKeys: Props = Object.assign({}, prevProps, nextProps);
  for (const key in dummyPropsWithAllKeys) {
    const rule = rules[key];
    if (
      rule
        ? !rule(prevProps[key], nextProps[key])
        : prevProps[key] !== nextProps[key]
    )
      return false;
  }
  return true;
}
