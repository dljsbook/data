const squish = (i: number, source: [number, number], target: [number, number]): number => {
  const percent = (i - source[0]) / (source[1] - source[0]);
  return target[0] + percent * (target[1] - target[0]);
};

export default squish;
