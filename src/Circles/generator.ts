import getRandom from '../utils/getRandom';

import {
  IPoint,
  IRange,
  IGeneratorFn,
  IGetX,
} from '../NonLinear';

type IGetPointProps = {
  noise: number;
  range: IRange;
  radius: number;
  getX: IGetX;
};

type IGetPoint = (props: IGetPointProps) => IPoint;

const getPoint: IGetPoint = ({
  noise,
  range,
  radius,
  getX,
}) => {
  const degree = getX(range);
  const x = Math.sin(degree) * radius + getRandom(0 - noise / 2, noise / 2);
  const y = Math.cos(degree) * radius + getRandom(0 - noise / 2, noise / 2);

  return {
    x,
    y,
  };
}

const defaultRange: IRange = [0, Math.PI * 2];

export const positiveGenerator: IGeneratorFn = (range = defaultRange, props) => getPoint({
  range,
  radius: 1,
  ...props,
});

export const negativeGenerator: IGeneratorFn = (range = defaultRange, props) => getPoint({
  range,
  radius: 0.5,
  ...props,
});
