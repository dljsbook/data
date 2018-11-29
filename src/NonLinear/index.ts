import * as tf from '@tensorflow/tfjs';
import Dataset from '../Dataset';
import log from '../utils/log';
import makeChart from '../utils/graphs/makeScatter';
import { COLORS } from '../config';
import generator from './generator';

export enum POLARITY {
  POS,
  NEG,
}

export interface INonLinearProps {
  num?: number;
  noise?: number;
}

export type IPoint = {
  x: number;
  y: number;
};

export type IGeneratorProps = {
  noise: number;
  getX: Function;
}

export type IRange = [number, number];

export type IGeneratorFn = (range: IRange, props: IGeneratorProps) => IPoint;

class NonLinear extends Dataset {
  private num = 200;
  private noise = 0.1;
  private generators: {
    [index: string]: IGeneratorFn;
  } = {};
  protected name: string;

  constructor(props: INonLinearProps) {
    super();

    this.init(props);
  }

  init = (props: INonLinearProps) => {
    if (props.num !== undefined) {
      this.num = props.num;
    }
    if (props.noise !== undefined) {
      this.noise = props.noise;
    }
  }

  registerGenerator = (polarity: POLARITY, fn: IGeneratorFn) => this.generators[polarity] = fn;
  setName = (name: string) => this.name = name;

  get = (num?: number, { random }: { random: boolean } = { random: true }) => {
    this.init({
      num,
    });

    const points = [
      POLARITY.POS,
      POLARITY.NEG,
    ].reduce((arr, type, index) => (arr || []).concat(generator({
      type,
      num: this.num / 2,
      noise: this.noise,
      random,
      fn: this.generators[type],
    }).map(point => ({
      ...point,
      index,
      color: COLORS[index],
    }))), []);

    const data = tf.tensor2d(points.map(({ x, y }) => [ x, y ]), [this.num, 2], 'float32');
    const labels = tf.tensor1d(points.map(({ index }) => index), 'float32');

    return {
      data,
      labels,
      print: async (target?: HTMLElement, chartOptions?: any) => {
        const width = 480;
        const height = 200;
        const chart = await makeChart(points, width, height, chartOptions);
        log(chart, { target, width, height: height + 40, name: this.name });
      }
    };
  }

  getForType = (type: POLARITY) => {
    const point = generator({
      type,
      num: 1,
      noise: this.noise,
      fn: this.generators[type],
    })[0];
    const data = tf.tensor2d([point.x, point.y], [1, 2], 'float32');
    const labels = tf.tensor1d([type === POLARITY.POS ? 0 : 1], 'float32');

    return {
      data,
      labels,
    };
  }
}

export default NonLinear;