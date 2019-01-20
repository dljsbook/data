import * as tf from '@tensorflow/tfjs';
import Dataset from '../Dataset';
import log from '../utils/log';
import makeScatter from '../utils/graphs/makeScatter';
import { COLORS } from '../config';
import generator from './generator';
// import * as vega from 'vega';

import {
  POLARITY,
  IPoint,
  // IGeneratorProps,
  // IRange,
  IGeneratorFn,
} from './types';

export interface INonLinearProps {
  num?: number|number[];
  noise?: number;
}

class NonLinear extends Dataset {
  private num:number|number[] = 200;
  private noise = 0.1;
  private generators: {
    [index: string]: IGeneratorFn;
  } = {};
  protected name: string;

  constructor(props: INonLinearProps) {
    super();

    this.init(props);
  }

  init = (props: INonLinearProps = {}) => {
    if (props.num !== undefined) {
      this.num = props.num;
    }
    if (props.noise !== undefined) {
      this.noise = props.noise;
    }
  }

  registerGenerator = (polarity: POLARITY, fn: IGeneratorFn) => this.generators[polarity] = fn;
  setName = (name: string) => this.name = name;

  get = (num?: number|number[], { random }: { random: boolean } = { random: true }) => {
    this.init({
      num,
    });

    const initialPoints: {
      x: number;
      y: number;
      label: number;
    }[] = [];

    const points = [
      POLARITY.POS,
      POLARITY.NEG,
    ].reduce((arr, type, label) => {
      const fn: IGeneratorFn = this.generators[type];
      const points: IPoint[] = generator({
        type,
        num: Array.isArray(this.num) ? this.num[label] : this.num / 2,
        noise: this.noise,
        random,
        fn,
      });
      const newPoints = points.map(point => ({
        ...point,
        label,
      }));

      return (arr || []).concat(newPoints);
    }, initialPoints);

    const dim = Array.isArray(this.num) ? this.num.reduce((sum, n) => sum + n, 0) : this.num;

    const data = tf.tensor2d(points.map(({ x, y }) => [ x, y ]), [dim, 2], 'float32');
    const labels = tf.tensor1d(points.map(({ label }) => label), 'float32');

    return {
      data,
      labels,
      print: async (target?: HTMLElement, chartOptions?: any) => {
        const width = 480;
        const height = 200 + 40;
        const chartPoints = points.map(point => ({
          ...point,
          color: COLORS[point.label],
        }));

        const chart = await makeScatter(chartPoints, width, height, chartOptions);
        log(chart, { target, width, height, name: this.name });
      }
    };
  }

  getForType = (type: POLARITY) => {
    const point: IPoint = generator({
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

// const renderHere = (target: any) => {
//   console.log('render here within data 2');
//   const vega: any = (window as any).vega;
//   vega.loader()
//     .load('https://vega.github.io/vega/examples/bar-chart.vg.json')
//     .then(function(data: any) { renderVega(JSON.parse(data)); });

//   function renderVega(spec: any) {
//     new vega.View(vega.parse(spec))
//       .renderer('canvas')  // set renderer (canvas or svg)
//       .initialize(target) // initialize view within parent DOM container
//       .hover()             // enable hover encode set processing
//       .run();
//   }
// }

export default NonLinear;

export {
  POLARITY,
  IPoint,
  IGeneratorProps,
  IRange,
  IGeneratorFn,
  IGetX,
} from './types';
