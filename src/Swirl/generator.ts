import getRandom from '../utils/getRandom';

interface IGeneratorProps {
  noise: number;
  num: number;
  polarity: POLARITY;
  range?: [number, number];
}

export enum POLARITY {
  POS,
  NEG,
}

const withNoise = (point, noise) => point + getRandom(0 - noise / 2, noise / 2);

const getDot = ({
  noise,
  range,
  polarity,
}) => {
  const degree = getRandom(range[0], range[1]);
  const radius = degree;
  const mult = polarity === POLARITY.POS ? 1 : -1;
  const x = withNoise(Math.sin(degree) * radius * mult, noise);
  const y = withNoise(Math.cos(degree) * radius * mult, noise);

  return {
    x,
    y,
  };
}

const generator = ({
  num,
  noise,
  range = [0, Math.PI / 2 * 7],
  polarity,
}: IGeneratorProps) => {
  const dots = [];

  for (let i = 0; i < num; i++) {
    dots.push(getDot({ polarity, noise, range }));
  }
  return dots;
};

export default generator;
