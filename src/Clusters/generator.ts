import getRandom from '../utils/getRandom';
import pad from '../utils/pad';

import {
  IPoint,
  IRange,
  IGeneratorFn,
  IGetX,
} from '../NonLinear';

type IGetY = (x: number) => number;

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
