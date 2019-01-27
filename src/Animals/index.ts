// import * as tf from '@tensorflow/tfjs';
import * as Papa from 'papaparse';
import Dataset from '../Dataset';
// import log from '../utils/log';
import {
  DATA,
} from './config';

type IData = {
  images: string[];
  labels: string[];
};

class Animals extends Dataset {
  private data: IData;

  constructor() {
    super();

    this.load(async () => {
      await this.loadDataset();
    });
  }

  loadDataset = async () => {
    const url = `${DATA.root}/${DATA.data}`;
    const csvText = await this.loadFromURL(url, 'text');
    const rows = Papa.parse(csvText, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
    }).data;

    const data = await Promise.all(rows.map(row => {
      const label = row['Category'];
      const src = `${DATA.root}/${row['Link']}`;

      return {
        src,
        label,
      };

      // return this.loadFromURL(src, 'blob').then(img => ({
      //   img,
      //   category,
      // }));
    }));

    this.data = {
      images: data.map(row => row.img),
      labels: data.map(row => row.category),
    };
  }

  getData = () => this.data;

  // print = (prediction: tf.Tensor, target?: HTMLElement, { num }: {
  //   num?: number;
  // } = {}) => {
  //   const syncedPreds = prediction.dataSync();
  //   const preds = Array.from(syncedPreds).reduce((obj, el, index) => ({
  //     ...obj,
  //     [el]: index,
  //   }), {});

  //   const predictionsAsNumbers = Object.keys(preds).map(k => Number(k)).sort((a, b) => b - a);

  //   const predictions = predictionsAsNumbers.slice(0, num || 5).map(key => [key, preds[key]]).map(([confidence, id]) => {
  //     const label = this.data.labels[id];
  //     return {
  //       label,
  //       confidence,
  //     };
  //   });

  //   log(predictions, { target, name: 'Predictions' });
  // }
}

export default Animals;
