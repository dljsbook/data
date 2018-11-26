import getRandom from '../utils/getRandom';

export enum POLARITY {
  POS,
  NEG,
}

const getDot = ({
  fn,
  noise,
  range,
}) => {
  const x = getRandom(range[0], range[1]);
  const y = getRandom(0, 1) * fn(x);
  const radius = getRandom(noise);

  return {
    x,
    y,
    // y,
    // x: x + (Math.sin(theta) * radius),
    // y: fn(x) + (Math.cos(theta) * radius),
  };
}

const getDotType = {
  [POLARITY.POS]: (noise, range = [-1, 1]) => getDot({
    fn: x => x < 0 ? 1 : -1,
    noise,
    range,
  }),
  [POLARITY.NEG]: (noise, range = [-1, 1]) => getDot({
    fn: x => x < 0 ? -1 : 1,
    noise,
    range,
  }),
}

const getRandomType = () => Math.random() >= 0.5 ? POLARITY.POS : POLARITY.NEG;

interface IGeneratorProps {
  type: POLARITY;
  noise: number;
  num: number;
  range?: [number, number];
}

const generator = ({
  type,
  num,
  noise,
  range,
}: IGeneratorProps) => {
  const dots = [];

  for (let i = 0; i < num; i++) {
    if (type === undefined) {
      type = getRandomType();
    }
    dots.push(getDotType[type](noise, range));
  }
  return dots;
};

export default generator;
