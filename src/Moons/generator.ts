import getRandom from '../utils/getRandom';

import {
  // POLARITY,
  IPoint,
  IRange,
  IGeneratorFn,
  IGetX,
} from '../NonLinear';

const K = 2;
const A = 7 * K;

type IParabola = (args: {
  a: number;
  h: number;
  k: number;
  x: number;
}) => number;

const parabola: IParabola = ({ a, h, k, x }) => (a * Math.pow((x - h), 2)) + k;

type IGetPointFn = (n: number) => number;

type IGetPointProps = {
  fn: IGetPointFn;
  noise: number;
  range: IRange;
  getX: IGetX;
};

type IGetPoint = (props: IGetPointProps) => IPoint;

const getPoint: IGetPoint = ({
  fn,
  noise,
  range,
  getX,
}) => {
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
  a,
  h,
  k,
}: IMakeGeneratorProps): IGeneratorFn => (
  range = defaultRange,
  {
    noise,
    getX,
  },
) => {
  const fn: IGetPointFn = x => parabola({ x, a, h, k });

  return getPoint({
    fn,
    range,

    noise,
    getX,
  });
};

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
