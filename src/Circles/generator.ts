import getRandom from '../utils/getRandom';

interface IGeneratorProps {
  radius: number;
  noise: number;
  num: number;
  range?: [number, number];
}

const getDot = ({
  noise,
  range,
  radius,
}) => {
  const degree = getRandom(range[0], range[1]);
  const x = Math.sin(degree) * radius + getRandom(0 - noise / 2, noise / 2);
  const y = Math.cos(degree) * radius + getRandom(0 - noise / 2, noise / 2);

  return {
    x,
    y,
  };
}

const generator = ({
  radius,
  num,
  noise,
  range = [0, Math.PI * 2],
}: IGeneratorProps) => {
  const dots = [];

  for (let i = 0; i < num; i++) {
    dots.push(getDot({ radius, noise, range }));
  }
  return dots;
};

export default generator;
