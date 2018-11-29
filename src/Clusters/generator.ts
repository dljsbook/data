import getRandom from '../utils/getRandom';

import {
  POLARITY,
  IPoint,
  IRange,
  IGeneratorFn,
} from '../NonLinear';

const getPoint = ({
  noise,
  range,
  getX,
  getY,
}) => {
  const x = getRandom(range[0], range[1]);
  const y = getRandom(0, 1) * getY(x);
  const radius = getRandom(noise);

  return {
    x,
    y,
  };
}

const defaultRange: IRange = [-1, 1];

export const positiveGenerator: IGeneratorFn = (range = defaultRange, props) => getPoint({
  range,
  getY: x => x < 0 ? 1 : -1,
  ...props,
});

export const negativeGenerator: IGeneratorFn = (range = defaultRange, props) => getPoint({
  range,
  getY: x => x < 0 ? -1 : 1,
  ...props,
});
