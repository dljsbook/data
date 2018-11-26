import * as tf from '@tensorflow/tfjs';
import Dataset from '../Dataset';
import log from '../utils/log';
import makeChart from '../utils/graphs/makeScatter';
import { COLORS } from '../config';
import generator, {
  POLARITY,
} from './generator';

interface IMoonsProps {
  num?: number;
}

// const getTensor = (points: number[], num: number): tf.Tensor2D => tf.tensor2d(points, [num, 1]);

class Moons extends Dataset {
  private num = 200;
  init = (props: IMoonsProps) => {
    if (props.num !== undefined) {
      this.num = props.num;
    }
  }

  get = (num?: number) => {
    this.init({
      num,
    });

    const points = [
      POLARITY.POS,
      POLARITY.NEG,
    ].reduce((arr, type, index) => (arr || []).concat(generator({
      type,
      num: this.num / 2,
      noise: 0.1,
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
      print: async () => {
        const width = 480;
        const height = 200;
        const chart = await makeChart(points, width, height);
        log(chart, { width, height: height + 40, name: 'Moons' });
      }
    };
  }

  getForType = (type: POLARITY) => {
    const point = generator({
      type,
      num: 1,
      noise: 0,
    })[0];
    const data = tf.tensor2d([point.x, point.y], [1, 2], 'float32');
    const labels = tf.tensor1d([type === POLARITY.POS ? 0 : 1], 'float32');

    return {
      data,
      labels,
    };
  }
}

export default new Moons();

export { POLARITY } from './generator';
