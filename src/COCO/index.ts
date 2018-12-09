import * as tf from '@tensorflow/tfjs';
import Dataset from '../Dataset';
import classes from './classes';
import {
  COLORS,
} from '../config';
import {
  GET_MANIFEST,
  GET_IMAGES,
  BUCKET,
  GET_CATEGORIES,
  // GET_IMAGE_PATH,
} from './config';

import {
  DATAROOT,
} from '../config';

import log from '../utils/log';
import rand from '../utils/rand';

const getRounded = (width: number) => {
  const rounded = width * 0.05;
  if (rounded < 3) {
    return 3;
  } else if (rounded > 8) {
    return 8;
  }
  return rounded;
};

const createShape = require('shape-drawing').createShape;

const getRandomBucket = () => rand([
  BUCKET.TRAIN,
  BUCKET.VAL,
]);

type Annotation = {
  cat: number;
  bbox: [number, number, number, number];
}

type IData = {
  [index: string]: {
    images: {
      [index: string]: {
        file: string,
        anns: Annotation[],
        h: number,
        w: number,
      }[];
    };
    categories: {
      [index: string]: string;
    };
    annotations: {
      [index: string]: number[];
    };
  }
};

interface ICOCOProps {
}

class COCO extends Dataset {
  private data: IData;
  private manifest: {
    [index: string]: string;
  } = {};
  private manifestIndex: {
    [index: string]: number;
  } = {};

  public classes: {
    [index: string]: string;
  } = classes;

  constructor() {
    super();

    this.load(async () => {
      await this.loadDataset(BUCKET.VAL);
      await this.loadDataset(BUCKET.TRAIN);
    });
  }

  loadNextImages = async (bucket: BUCKET) => {
    if (!this.manifest[bucket]) {
      this.manifest[bucket] = await this.loadFromURL(GET_MANIFEST(bucket), 'json');
    }

    const nextURL = this.manifest[bucket][this.manifestIndex[bucket] || 0];

    if (!nextURL) {
      throw new Error('No more images to load');
    }

    const images = await this.loadFromURL(GET_IMAGES(bucket, nextURL.split('/').pop()), 'json');

    this.manifestIndex[bucket] = (this.manifestIndex[bucket] || 0) + 1;

    return images;
  }

  loadDataset = async (bucket: BUCKET) => {
    const images = await this.loadNextImages(bucket);
    const categories = await this.loadFromURL(GET_CATEGORIES(bucket), 'json');

    const annotations = images.reduce((allAnns, { anns }, index) => (anns || []).reduce((obj, { cat }) => {
      if ((obj[cat] || []).includes(index)) {
        return obj;
      }

      return {
        ...obj,
        [cat]: [
          ...(obj[cat] || []),
          index,
        ],
      };
    }, allAnns), {});

    this.data = {
      ...this.data,
      [bucket]: {
        images,
        categories,
        annotations,
      },
    };
  }

  getRandomLabel = (bucket: BUCKET) => {
    if (this.loaded === false) {
      throw new Error('Dataset not loaded yet, call ready()');
    }
    if (bucket === undefined) {
      throw new Error('You must provide a bucket');
    }

    return rand(Object.keys(this.data[bucket].annotations));
  }

  getImage = async (bucket: BUCKET = getRandomBucket(), labelId?: string, imageId?: number) => {
    if (!this.loaded) {
      await this.ready();
    }

    if (labelId === undefined) {
      labelId = this.getRandomLabel(bucket);
    }

    if (imageId === undefined) {
      imageId = rand(this.data[bucket].annotations[labelId]);
    }

    const {
      images,
      categories,
    } = this.data[bucket];

    const {
      file,
      anns,
      h,
      w,
    } = rand(Object.values(images));

    const src = `${DATAROOT}${GET_IMAGES(bucket, `data/${file}`)}`;

    const img = await loadImage(src);
    // we call this so subsequent src uses don't run into cross origin issues
    tf.fromPixels(img);
    const image = await tf.image.cropAndResize(
      tf.fromPixels(img).expandDims(0),
      [[0, 0, img.width, img.height]],
      [1],
      [416, 416],
    );
    const annotations = anns.map(ann => ({
      ...ann,
      label: categories[ann.cat],
    }));

    return {
      src,
      image,
      annotations,
      print: async (target) => {
        const src = await print(img, annotations);
        log(src, { target, name: file });
      },
    };
  }

  // translatePrediction = (prediction: tf.Tensor, num = 5) => {
  //   const preds = [...prediction.dataSync()].reduce((obj, el, index) => ({
  //     ...obj,
  //     [el]: index,
  //   }), {});

  //   const predictions = Object.keys(preds).map(k => Number(k)).sort((a, b) => b - a).slice(0, num).map(k => [k, preds[k]]).map(([confidence, id]) => {
  //     const label = this.data.categories[id];
  //     // console.log('id', id, 'label', label, 'confidence', confidence);
  //     return {
  //       label,
  //       confidence,
  //     };
  //   });

  //   log(predictions, { name: 'Predictions' });
  // }
}

const loadImage = (src: string): Promise<HTMLImageElement> => new Promise((resolve, reject) => {
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
    return croppedImage;
    // return croppedImage.expandDims(0).toFloat().div(tf.scalar(127)).sub(tf.scalar(1));
  });
};

const print = async (img, anns) => {

  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, img.width, img.height);

  const shape = createShape(ctx, {
    lineWidth: 3,
  });

  anns.sort((a, b) => {
    return a[0] - b[0];
  }).forEach(({ bbox, label }, index) => {
    const i = index;
    const color = COLORS[index % COLORS.length];
    const dims = [
      ...bbox,
      5,
    ];
    shape
      .rect(...dims)
      .setStrokeStyle(color.fade(.1).toString())
      .setFillStyle(color.fade(.85).toString())
      .fill()
      .stroke();

    const getArrowPoints = ({
      left,
      top,
      // boxWidth,
      windowWidth,
      windowHeight,
    }) => {
      const tooltipWidth = 150;
      const tooltipHeight = 30;
      const arrowHeight = 10;
      const arrowXCenter = 20;
      // width / 2;
      const arrowWidth = 20;

      const points = [
        { x: left + arrowXCenter, y: top, },
        { x: left + (arrowXCenter - (arrowWidth / 2)), y: top - arrowHeight, },
        { x: left, y: top - arrowHeight, },
        { x: left, y: top - (arrowHeight + tooltipHeight), },
        { x: left + tooltipWidth, y: top - (arrowHeight + tooltipHeight), },
        { x: left + tooltipWidth, y: top - (arrowHeight), },
        { x: left + (arrowXCenter + (arrowWidth / 2)), y: top - (arrowHeight), },
        { x: left + arrowXCenter, y: top, },
      ];

      let minX = null;
      let minY = null;
      let maxX = null;
      let maxY = null;

      points.forEach(point => {
        if (minX === null || minX > point.x) {
          minX = point.x;
        }
        if (minY === null || minY > point.y) {
          minY = point.y;
        }
        if (maxX === null || maxX < point.x) {
          maxX = point.x;
        }
        if (maxY === null || maxY < point.y) {
          maxY = point.y;
        }
      });

      let bumpMinX = 0;
      if (minX < 0) {
        bumpMinX = 0 - minX;
      }
      let bumpMinY = 0;
      if (minY < 0) {
        bumpMinY = 0 - minY;
      }
      let bumpMaxX = 0;
      if (maxX > windowWidth) {
        bumpMaxX = maxX - windowWidth;
      }
      let bumpMaxY = 0;
      if (maxY > windowHeight) {
        bumpMaxY = 0 - maxY;
      }

      return points.reduce((arr, { x, y }) => ([
        ...arr,
        x + bumpMinX - bumpMaxX,
        y + bumpMinY - bumpMaxY,
      ]), []);
    };

    const points = getArrowPoints({
      left: bbox[0],
      top: bbox[1],
      // boxWidth: bbox[2],
      windowWidth: img.width,
      windowHeight: img.height,
    });

    shape
      .setLineCap("round")
      .setLineJoin("round")
      .polyline(...points)
      .setStrokeStyle(color.fade(0.2).toString())
      .setFillStyle(color.fade(0.0).toString())
      .stroke()
      .fill();
    ctx.font = '14px';
    ctx.fillStyle = 'black';
    ctx.fillText(label, points[6] + 10, points[7] + 20);
  });

  return canvas.toDataURL();
};

export default COCO;

export { BUCKET } from './config';
