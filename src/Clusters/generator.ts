import getRandom from '../utils/getRandom';

import {
  // POLARITY,
  IPoint,
  IRange,
  IGeneratorFn,
  IGetX,
} from '../NonLinear';

type IGetY = (x: number) => number;

// let counter = 0;

const squish = (i: number, source: [number, number], target: [number, number]) => {
  const percent = (i - source[0]) / (source[1] - source[0]);
  return target[0] + percent * (target[1] - target[0]);
};

const pad = (n: number, range: [number, number]) => {
  if (n >= 0) {
    return squish(n, [0, 1], range);
  }

  return squish(n, [-1, 0], [range[1] * -1, range[0] * -1]);
};

const PADDING = 0.15;
const padding: [number, number] = [PADDING, 1 - PADDING];

type IGetPointProps = {
  noise: number;
  range: IRange;
  getX: IGetX;
  getY: IGetY;
  num: number;
  step: number;
};

type IGetPoint = (props: IGetPointProps) => IPoint;

const getPoint: IGetPoint = ({
  noise,
  range,
  getX,
  getY,
  num,
  step,
}) => {
  const x = getX(range);
  const y = getRandom(0, 1) * getY(x);

  return {
    x: pad(x, padding),
    y: pad(y, padding),
  };
}

const defaultRange: IRange = [-1, 1];

export const positiveGenerator: IGeneratorFn = (range = defaultRange, {
  noise,
  getX,
  num,
  step,
}) => getPoint({
  range,
  getY: x => x < 0 ? 1 : -1,
  noise,
  getX,
  num,
  step,
});

export const negativeGenerator: IGeneratorFn = (range = defaultRange, {
  noise,
  getX,
  num,
  step,
}) => getPoint({
  range,
  getY: x => x < 0 ? -1 : 1,
  noise,
  getX,
  num,
  step,
});
