import squish from './squish';

const pad = (n: number, range: [number, number]) => {
  if (n >= 0) {
    return squish(n, [0, 1], range);
  }

  return squish(n, [-1, 0], [range[1] * -1, range[0] * -1]);
};

export default pad;
