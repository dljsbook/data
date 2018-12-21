import * as tf from '@tensorflow/tfjs';
import Dataset from '../Dataset';
import Image from '../utils/Image';

import {
  IMAGE_SIZE,
  CLASSES,
  DATA,
} from './config';

const SIDE = Math.sqrt(IMAGE_SIZE);

class MNIST extends Dataset {
  private data: {
    [index: string]: {
      data: tf.Tensor;
      labels: tf.Tensor;
    };
  } = {};
  private indices: {
    [index: string]: {
      [index: number]: number[];
    };
  } = {};

  constructor() {
    super({
      numberOfClasses: CLASSES,
    });

    this.load(async () => {
      await this.loadDataset('train');
      await this.loadDataset('test');
    });
  }

  loadDataset = async (set: string) => {
    const loadedData = await this.loadFromURL(DATA[set].images);
    const data = loadedData.slice(16, loadedData.length);
    const loadedLabels = await this.loadFromURL(DATA[set].labels);
    const labels = loadedLabels.slice(8, loadedLabels.length);

    const numbers = {};

    for (var i = 0; i < (labels.length); i++) {
      const label = labels[i];
      if (label < 0 || label > 9) {
        throw new Error(`bad MNIST label: ${label}`);
      }
      // const start = (i * IMAGE_SIZE);

      if (!numbers[label]) {
        numbers[label] = [];
      }

      numbers[label].push(i);
    }

    this.indices[set] = numbers;

    const n = data.length / IMAGE_SIZE;

    this.data[set] = {
      data: tf.tensor4d(data, [n, 28, 28, 1], 'int32'),
      // labels,
      labels: this.oneHot(labels),
    };
  }

  getImageForLabel = (label: string | number = Math.floor(Math.random() * CLASSES), set: string = 'train') => {
    if (!this.loaded) {
      throw new Error('Dataset not loaded yet, call ready()');
    }
    if (!this.indices[set][label]) {
      throw new Error(`No label found for ${label}; please specify a label between 0-9`);
    }
    const indices = this.indices[set][label];
    const index = indices[Math.floor(Math.random()*indices.length)];
    // const start = (index * IMAGE_SIZE);
    const pixels = this.data[set].data.slice(index, 1);
    if (pixels.size !== (28*28)) {
      throw new Error(`error at index: ${index} and label: ${label}, pixel length: ${pixels.size}`);
    }

    return new Image(pixels, label, SIDE, 'MNIST');
  }

  get = (set:string, amount: number) => {
    if (!this.loaded) {
      throw new Error('Dataset not loaded yet, call ready()');
    }
    if (!set || typeof set !== 'string') {
      throw new Error('Please provide a dataset to get');
    }
    if (!this.data[set]) {
      throw new Error(`Specified dataset ${set} not available. Available datasets: ${Object.keys(this.data).join(', ')}`);
    }

    if (!amount) {
      return this.data[set];
    }

    const {
      data,
      labels,
    } = this.data[set];

    return {
      data: data.slice(0, amount),
      labels: labels.slice(0, amount),
    };
  }
}

export default MNIST;
