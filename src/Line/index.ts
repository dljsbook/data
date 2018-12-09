import * as tf from '@tensorflow/tfjs';
import Dataset from '../Dataset';
import makeChart from './makeChart';
import log from '../utils/log';
import getAtStep from '../utils/getAtStep';
// import data from '../utils/data';

interface ILineProps {
  start?: number;
  end?: number;
  num?: number;
  slope?: number;
  intercept?: number;
}

const getY = (x: number, slope: number, intercept: number) => slope * x + intercept;
// const getX = (step: number, num: number, start: number, end: number) => start + ((end - start) * step / (num - 1));
const getTensor = (points: number[], num: number): tf.Tensor2D => tf.tensor2d(points, [num, 1]);

class Line extends Dataset {
  private start = 0;
  private end = 3;
  private num = 4;
  private slope = 2;
  private intercept = 0;

  init = (props: ILineProps) => {
    if (props.start !== undefined) {
      this.start = props.start;
    }
    if (props.end !== undefined) {
      this.end = props.end;
    }
    if (props.num !== undefined) {
      this.num = props.num;
    }
    if (props.slope !== undefined) {
      this.slope = props.slope;
    }
    if (props.intercept !== undefined) {
      this.intercept = props.intercept;
    }
  }

  get = (num?: number) => {
    this.init({ num });
    const points = [];
    for (let step = 0; step < this.num; step++) {
      const x = getAtStep(step, this.num, this.start, this.end);
      const y = getY(x, this.slope, this.intercept);
      points.push([x, y]);
    }
    const data = getTensor(points.map(([x]) => x), this.num);
    const labels = getTensor(points.map(([_, y]) => y), this.num);
    return {
      data,
      labels,
      print: async (target?: HTMLElement) => {
        const width = 480;
        const height = 200;
        const chart = await makeChart(points, width, height);
        log(chart, { target, height: height + 40, name: 'Line' });
      },
    };
  }
}

export default new Line();
