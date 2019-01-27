// import * as tf from '@tensorflow/tfjs';
import * as Papa from 'papaparse';
import Dataset from '../Dataset';
// import log from '../utils/log';
import {
  DATA,
} from './config';

class Animals extends Dataset {
  // private data: IData;

  constructor() {
    super();

    this.load(async () => {
      await this.loadDataset();
    });
  }

  loadDataset = async () => {
    const url = `${DATA.root}/${DATA.data}`;
    const data = await this.loadFromURL(url, 'text');
    const rows = Papa.parse(data, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
    }).data;

    const images = await Promise.all(rows.map(row => {
      const category = row['Category'];
      const imgURL = `${DATA.root}/${row['Local Link']}`;
      console.log(imgURL);

      return this.loadFromURL(imgURL).then(img => {
        return {
          img,
          category,
        };
      });
    }));

    console.log('images', images);

    // this.data = {
    //   images,
    //   labels,
    // };
  }

  // getImage = async (labelId?: string) => {
  //   const image = await cropAndResizeImage(tf.fromPixels(img), [224, 224]);

  //   return {
  //     image,
  //     label,
  //     print: (target?: HTMLElement) => {
  //       log(img.src, { target, name: label });
  //     },
  //   };
  // }

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
