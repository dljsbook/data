import * as tf from '@tensorflow/tfjs';
import Dataset from '../Dataset';
import log from '../utils/log';
import makeChart from '../utils/graphs/makeScatter';
import { COLORS } from '../config';
import generator, {
  POLARITY,
} from './generator';

interface ISwirlProps {
  num?: number;
}

const getTensor = (points: number[], num: number): tf.Tensor2D => tf.tensor2d(points, [num, 1]);

class Swirl extends Dataset {
  private num = 200;
  init = (props: ISwirlProps) => {
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
    ].reduce((arr, polarity, index) => (arr || []).concat(generator({
      polarity,
      num: this.num / 2,
      noise: 1,
    }).map(point => ({
      ...point,
      color: COLORS[index],
    }))), []);

    const data = getTensor(points.map(({ x }) => x), this.num);
    const labels = getTensor(points.map(({ y }) => y), this.num);

    return {
      data,
      labels,
      print: async () => {
        const width = 480;
        const height = 200;
        const chart = await makeChart(points, width, height);
        log(chart, { width, height: height + 40, name: 'Swirl' });
      }
    };
  }
}

export default new Swirl();
