import * as tf from '@tensorflow/tfjs';
import Dataset from '../Dataset';
import {
  DATA,
} from './config';
// import Image from '../utils/Image';
import log from '../utils/log';

interface IImageNetProps {
}

type IData = {
  images: {
    [index: string]: string[];
  };
  labels: {
    [index: string]: string;
  };
};

const getRandomIndex = (arr: any[] = []) => Math.floor(Math.random() * (arr.length - 1));
const rand = (arr: any[] = []) => arr[getRandomIndex(arr)];

class ImageNet extends Dataset {
  private data: IData;

  constructor() {
    super();

    this.load(async () => {
      await this.loadDataset();
    });
  }

  loadDataset = async () => {
    const images = await this.loadFromURL(DATA.images, 'json');
    const labels = await this.loadFromURL(DATA.labels, 'json');

    this.data = {
      images,
      labels,
    };

    // const numbers = {};

    // for (var i = 0; i < (labels.length); i++) {
    //   const label = labels[i];
    //   if (label < 0 || label > 9) {
    //     throw new Error(`bad MNIST label: ${label}`);
    //   }
    //   const start = (i * IMAGE_SIZE);

    //   if (!numbers[label]) {
    //     numbers[label] = [];
    //   }

    //   numbers[label].push(i);
    // }

    // this.indices[set] = numbers;

    // const n = data.length / IMAGE_SIZE;

    // this.data[set] = {
    //   data: tf.tensor4d(data, [n, 28, 28, 1], 'int32'),
    //   labels: this.oneHot(labels),
    // };
  }

  getRandomId = () => {
    if (!this.loaded) {
      throw new Error('Dataset not loaded yet, call ready()');
    }

    return rand(Object.keys(this.data.labels));
  }

  getImage = async (labelId: string = this.getRandomId()) => {
    if (!this.loaded) {
      throw new Error('Dataset not loaded yet, call ready()');
    }

    const label = this.data.labels[labelId];

    const src = rand(this.data.images[labelId]);

    const img = await loadImage(src);
    const image = await cropAndResizeImage(tf.fromPixels(img), [224, 224]);

    return {
      image,
      label,
      print: () => {
        log(src, { name: label });
      },
    };
  }

  translatePrediction = (prediction: tf.Tensor, num = 5) => {
    const preds = [...prediction.dataSync()].reduce((obj, el, index) => ({
      ...obj,
      [el]: index,
    }), {});

    const predictions = Object.keys(preds).map(k => Number(k)).sort((a, b) => b - a).slice(0, num).map(k => [k, preds[k]]).map(([confidence, id]) => {
      const label = this.data.labels[id];
      // console.log('id', id, 'label', label, 'confidence', confidence);
      return {
        label,
        confidence,
      };
    });

    log(predictions, { name: 'Predictions' });
  }
}

const loadImage = (src: string) => new Promise((resolve, reject) => {
  const img = new Image();
  img.src = src;
  img.crossOrigin = '';
  img.onload = () => resolve(img);
  img.onerror = (err) => reject(err);
});

const crop = (img: tf.Tensor3D) => {
  const size = Math.min(img.shape[0], img.shape[1]);
  const centerHeight = img.shape[0] / 2;
  const beginHeight = centerHeight - (size / 2);
  const centerWidth = img.shape[1] / 2;
  const beginWidth = centerWidth - (size / 2);
  return img.slice([beginHeight, beginWidth, 0], [size, size, 3]);
}

// convert pixel data into a tensor
const cropAndResizeImage = async (img: tf.Tensor3D, dims: [number, number]): Promise<tf.Tensor3D> => {
  return tf.tidy(() => {
    const croppedImage = crop(tf.image.resizeBilinear(img, dims));
    return croppedImage.expandDims(0).toFloat().div(tf.scalar(127)).sub(tf.scalar(1));
  });
};

export default ImageNet;
