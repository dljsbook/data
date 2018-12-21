import getRandom from '../utils/getRandom';

import {
  POLARITY,
  IPoint,
  IRange,
  IGeneratorFn,
  IGetX,
} from '../NonLinear';

const withNoise = (point: number, noise: number) => point + getRandom(0 - noise / 2, noise / 2);

type IGetPointProps = {
  noise: number;
  range: IRange;
  getX: IGetX;
  polarity: POLARITY;
};

type IGetPoint = (props: IGetPointProps) => IPoint;

const getPoint: IGetPoint = ({
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

export const positiveGenerator: IGeneratorFn = (range = defaultRange, {
  noise,
  getX,
}) => getPoint({
  range,
  polarity: POLARITY.POS,

  noise,
  getX,
});

export const negativeGenerator: IGeneratorFn = (range = defaultRange, {
  noise,
  getX,
}) => getPoint({
  range,
  polarity: POLARITY.NEG,

  noise,
  getX,
});
