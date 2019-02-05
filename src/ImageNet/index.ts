import * as tf from '@tensorflow/tfjs';
import Dataset from '../Dataset';
import {
  DATA,
} from './config';
import log from '../utils/log';
import rand from '../utils/rand';
import classes from './classes';
import loadImage from '../utils/loadImage';
import processImage from '../utils/processImage';

type IData = {
  images: {
    [index: string]: string[];
  };
  labels: {
    [index: string]: string;
  };
};

type IObject = {
  [index: string]: string;
};

const getImage = (src: string) => {
  const img = new Image();
  img.src = src;
  img.crossOrigin = '';
  return img;
};

const without = (images: string[], filesTried: string[]): string[] => {
  return images.filter(src => !filesTried.includes(src));
};

class ImageNet extends Dataset {
  private data: IData;
  private manifest: string[];
  private manifestIndex: number = 0;

  static classes: IObject = classes;
  public classes: IObject = classes;

  public dog: HTMLImageElement;
  public blackwhite: HTMLImageElement;

  constructor() {
    super();

    this.load(async () => {
      await this.loadDataset();
    });

    this.dog = getImage(`https://i.imgur.com/4k7pTbg.jpg`);
    this.blackwhite = getImage('https://i.imgur.com/kVFmLSs.jpg');
  }

  loadNextImages = async () => {
    if (!this.manifest) {
      this.manifest = await this.loadFromURL(DATA.imagesManifest, 'json');
    }

    const nextURL = this.manifest[this.manifestIndex];

    if (!nextURL) {
      throw new Error('No more images to load');
    }

    const images = await this.loadFromURL(DATA.getImages(nextURL), 'json');

    this.manifestIndex++;

    return images;
  }

  loadDataset = async () => {
    const images = await this.loadNextImages();
    const labels = await this.loadFromURL(DATA.labels, 'json');

    this.data = {
      images,
      labels,
    };
  }

  getRandomId = async () => {
    if (!this.loaded) {
      await this.ready();
    }

    return rand(Object.keys(this.data.labels));
  }

  loadRandomImage = async (labelId: string, imagesTried: string[] = []): Promise<HTMLImageElement> => {
    if (imagesTried.length >= this.data.images[labelId].length) {
      throw new Error(`No images could be loaded for label ${labelId}`);
    }
    const src = rand(without(this.data.images[labelId], imagesTried));
    try {
      return loadImage(src);
    } catch(err) {
      return this.loadRandomImage(labelId, [
        ...imagesTried,
        src,
      ]);
    }
  }

  getImage = async (labelId?: string) => {
    if (!this.loaded) {
      await this.ready();
    }

    if (!labelId) {
      labelId = await this.getRandomId();
    }

    if (!labelId) {
      throw new Error('No label could be found');
    }

    const label = this.data.labels[labelId];

    const img = await this.loadRandomImage(labelId);

    const image = await ImageNet.processImage(img, [224, 224]);

    return {
      image,
      label,
      print: (target?: HTMLElement) => {
        log(img.src, { target, name: label });
      },
    };
  }

  print = (prediction: tf.Tensor, target?: HTMLElement, { num }: {
    num?: number;
  } = {}) => {
    const syncedPreds = prediction.dataSync();
    const preds = Array.from(syncedPreds).reduce((obj, el, index) => ({
      ...obj,
      [el]: index,
    }), {});

    const predictionsAsNumbers = Object.keys(preds).map(k => Number(k)).sort((a, b) => b - a);

    const predictions = predictionsAsNumbers.slice(0, num || 5).map(key => [key, preds[key]]).map(([confidence, id]) => {
      const label = this.data.labels[id];
      return {
        label,
        confidence,
      };
    });

    log(predictions, { target, name: 'Predictions' });
  }

  static processImage = async (image: HTMLImageElement | string, dims: [number, number] = [224, 224]) => {
    return await processImage(image, dims);
  }
}


export default ImageNet;
