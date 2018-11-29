import getRandom from '../utils/getRandom';

import {
  POLARITY,
  IPoint,
  IRange,
  IGeneratorFn,
} from '../NonLinear';

const K = 2;
const A = 7 * K;

const parabola = ({ a, h, k, x }) => (a * Math.pow((x - h), 2)) + k;
const getPoint = ({
  fn,
  noise,
  range,
  getX,
}): IPoint => {
  const x = getX(range);

  const radius = getRandom(noise);
  const theta = getRandom(Math.PI * 2);

  return {
    x: x + (Math.sin(theta) * radius),
    y: fn(x) + (Math.cos(theta) * radius),
  };
}

interface IMakeGeneratorProps {
  defaultRange: IRange;
  a: number;
  h: number;
  k: number;
}

const makeGenerator = ({
  defaultRange,
  ...rest
}: IMakeGeneratorProps): IGeneratorFn => (range = defaultRange, props) => getPoint({
 fn: x => parabola({ x, ...rest }),
 range,
 ...props,
});

export const positiveGenerator = makeGenerator({
  defaultRange: [0, 2 / 3],
  a: -1 * A,
  h: 1 / 3,
  k: K - 1,
});

export const negativeGenerator = makeGenerator({
  defaultRange: [1 / 3, 1],
  a: A,
  h: 2 / 3,
  k: -1,
});
