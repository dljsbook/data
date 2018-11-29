import getRandom from '../utils/getRandom';
import getAtStep from '../utils/getAtStep';

import {
  POLARITY,
} from '../NonLinear';

const getRandomType = () => Math.random() >= 0.5 ? POLARITY.POS : POLARITY.NEG;

interface IGeneratorProps {
  type: POLARITY;
  noise: number;
  num: number;
  range?: [number, number];
  random?: boolean;
  fn: Function;
}

const generator = ({
  type,
  num,
  noise,
  range,
  random,
  fn,
}: IGeneratorProps) => {
  const dots = [];

  for (let step = 0; step < num; step++) {
    if (type === undefined) {
      type = getRandomType();
    }

    const getX = (range) => {
      if (random !== false) {
        return getRandom(range[0], range[1]);
      }

      return getAtStep(step, num, range[0], range[1]);
    };

    dots.push(fn(range, {
      noise,
      getX,
    }));
  }
  return dots;
};

export default generator;
