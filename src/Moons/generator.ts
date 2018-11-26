import getRandom from '../utils/getRandom';

export enum POLARITY {
  POS,
  NEG,
}

const K = 2;
const A = 7 * K;

const parabola = ({ a, h, k, x }) => (a * Math.pow((x - h), 2)) + k;
const getDot = ({
  fn,
  noise,
  range,
}) => {
  const x = getRandom(range[0], range[1]);
  const radius = getRandom(noise);
  const theta = getRandom(Math.PI * 2);

  return {
    x: x + (Math.sin(theta) * radius),
    y: fn(x) + (Math.cos(theta) * radius),
  };
}

const getDotType = {
  [POLARITY.POS]: (noise, range = [0, 2 / 3]) => getDot({
    fn: x => parabola({ a: -1 * A, h: 1 / 3, k: K - 1, x}),
    noise,
    range,
  }),
  [POLARITY.NEG]: (noise, range = [1 / 3, 1]) => getDot({
    fn: x => parabola({ a: A, h: 2 / 3, k: -1, x}),
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
