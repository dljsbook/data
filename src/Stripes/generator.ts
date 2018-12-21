import getAtStep from '../utils/getAtStep';

import {
  IRange,
  IGeneratorFn,
  IPoint,
  IGetX,
} from '../NonLinear';

// let counter = 0;

const squish = (i: number, source: [number, number], target: [number, number]) => {
  const percent = (i - source[0]) / (source[1] - source[0]);
  return target[0] + percent * (target[1] - target[0]);
};

const getDividedDistribution = (num: number) => {
  const n = num;
  if (n <= 3) {
    return [n];
  } else if (n === 4) {
    return [2, 2];
  }

  const div = n / 3;

  if (n % 3 === 2) {
    return [Math.ceil(div), Math.floor(div), Math.ceil(div)];
  } else if (n % 3 === 0) {
    return [div, div, div];
  }
  return [Math.floor(div), Math.ceil(div), Math.floor(div)];
};

const getDistributions = (dist: number[]) => {
  if (dist.length === 1) {
    return Array(dist[0]).fill(DISTRIBUTION.CENTER);
  } else if (dist.length === 2) {
    return [
      ...Array(dist[0]).fill(DISTRIBUTION.TOP),
      ...Array(dist[1]).fill(DISTRIBUTION.BOTTOM),
    ];
  }
  return [
    ...Array(dist[0]).fill(DISTRIBUTION.TOP),
    ...Array(dist[1]).fill(DISTRIBUTION.CENTER),
    ...Array(dist[2]).fill(DISTRIBUTION.BOTTOM),
  ];
}

const getXForDistribution = (step: number, num: number, dist: DISTRIBUTION, range: IRange) => {
  let x;
  if (dist === DISTRIBUTION.TOP) {
    x = getAtStep(step, num, range[0] / 2, range[1]);
    return squish(x, [-0.5, -.25], [-.5, 0]);
  }
  if (dist === DISTRIBUTION.BOTTOM) {
    x = getAtStep(step, num, range[0], range[1] / 2);
    return squish(x, [0.25, .5], [0, .5]);
  }

  x = getAtStep(step, num, range[0], range[1]);
  return squish(x, [-0.33333333, .333333333], [-0.5, 0.5]);
};

const getYForDistribution = (step: number, num: number, dist: DISTRIBUTION, range: IRange) => {
  let y;
  if (dist === DISTRIBUTION.TOP) {
    y = getAtStep(step, num, range[0] / 2, range[1]);
    return squish(y, [-0.5, -.25], [0, .5]);
  }
  if (dist === DISTRIBUTION.BOTTOM) {
    y = getAtStep(step, num, range[0], range[1] / 2);
    return squish(y, [.25, .5], [-.5, 0]);
  }

  y = getAtStep(step, num, range[0], range[1]);
  return squish(y, [-.333333, .333333333], [-0.5, 0.5]);
};

enum DISTRIBUTION {
  TOP,
  CENTER,
  BOTTOM,
}

const X_PADDING = 0.0;
const Y_PADDING = 0.6;

const getPadding = (start: number, end: number): [number, number] => [start + X_PADDING, end - Y_PADDING];

const getRangeForCluster = (x: number, y: number, cluster: number) => {
  if (cluster === 0) {
    return {
      x: squish(x, [-0.5, .5], getPadding(-1, 0)),
      y: squish(y, [-0.5, .5], getPadding(0, 1)),
    };
  }

  return {
    x: squish(x, [-0.5, .5], getPadding(0, 1)),
    y: squish(y, [-0.5, .5], getPadding(-1, 0)),
  };
};

type IGetY = (y: number) => number;

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
  const actualNum = num / 2;
  const cluster = Math.floor(step / actualNum);
  step = step - (cluster * actualNum);

  const dividedDistributions = getDividedDistribution(actualNum);
  const distributions = getDistributions(dividedDistributions);
  const distribution = distributions[step];

  let _x = getXForDistribution(step, actualNum, distribution, range);
  let _y = getYForDistribution(step, actualNum, distribution, range);

  const {
    x,
    y,
  } = getRangeForCluster(_x, _y, cluster);

  return {
    x,
    y: getY(y),
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
  getY: y => y,
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
  getY: (y: number) => -1 * y - Y_PADDING,
  noise,
  getX,
  num,
  step,
});
