import * as tf from '@tensorflow/tfjs';
import parseCsv from '../utils/parseCsv';
import log from '../utils/log';
import Dataset from '../Dataset';
import {
  DATA,
} from './config';

type IRow = {
  [index: string]: number;
};

class BostonHousing extends Dataset {
  private data: {
    [index: string]: IRow[];
  } = {};

  constructor() {
    super();

    this.load(async () => {
      await this.loadDataset('train');
      await this.loadDataset('test');
    });
  }

  loadDataset = async (set: string) => {
    const dataset = await this.loadFromURL(DATA[set], 'text');
    this.data[set] = parseCsv(dataset);
  }

  get = (set: string, num?: number) => {
    if (!this.loaded) {
      throw new Error('Dataset not loaded yet, call ready()');
    }

    const dataset = this.data[set];
    const labels = tf.tensor1d(dataset.map(({ medv }) => medv)).expandDims(1);

    const data = tf.tensor2d(dataset.map(({
      medv,
      ID,
      ...rest
    }) => Object.values(rest)));

    return {
      data,
      labels,
      print: async (target?: HTMLElement) => {
        log(dataset, { target, name: 'Boston Housing' });
      },
    };
  }
}

export default BostonHousing;
