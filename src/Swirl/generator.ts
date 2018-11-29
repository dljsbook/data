import getRandom from '../utils/getRandom';

import {
  POLARITY,
  IPoint,
  IRange,
  IGeneratorFn,
} from '../NonLinear';

const withNoise = (point, noise) => point + getRandom(0 - noise / 2, noise / 2);

const getPoint = ({
  noise,
  range,
  polarity,
  getX,
}) => {
  const degree = getX(range);
  const radius = degree;
  const mult = polarity === POLARITY.POS ? 1 : -1;
  const x = withNoise(Math.sin(degree) * radius * mult, noise);
  const y = withNoise(Math.cos(degree) * radius * mult, noise);

  return {
    x,
    y,
  };
}

const defaultRange: IRange = [0, Math.PI / 2 * 7];

export const positiveGenerator: IGeneratorFn = (range = defaultRange, props) => getPoint({
  range,
  polarity: POLARITY.POS,
  ...props,
});

export const negativeGenerator: IGeneratorFn = (range = defaultRange, props) => getPoint({
  range,
  polarity: POLARITY.NEG,
  ...props,
});
