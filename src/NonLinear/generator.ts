import getRandom from '../utils/getRandom';
import getAtStep from '../utils/getAtStep';

import {
  IPoint,
  POLARITY,
  IRange,
  IGetX,
} from './types';

const getRandomType = () => Math.random() >= 0.5 ? POLARITY.POS : POLARITY.NEG;

interface IGeneratorProps {
  type: POLARITY;
  noise: number;
  num: number;
  range?: IRange;
  random?: boolean;
  fn: (range: any, props: any) => IPoint;
}

const makeGetX = (random: boolean | undefined, step: number, num: number): IGetX => (range: IRange) => {
  if (random !== false) {
    return getRandom(range[0], range[1]);
  }

  return getAtStep(step, num, range[0], range[1]);
};

const generator = ({
  type,
  num,
  noise,
  range,
  random,
  fn,
}: IGeneratorProps): any[] => {
  const points: IPoint[] = [];

  for (let step = 0; step < num; step++) {
    if (type === undefined) {
      type = getRandomType();
    }

    const getX: IGetX = makeGetX(random, step, num);

    const props = {
      noise,
      getX,
      num,
      step,
    };

    const point: IPoint = fn(range, props);

    points.push(point);
  }
  return points;
};

export default generator;
