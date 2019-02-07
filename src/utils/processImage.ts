import * as tf from '@tensorflow/tfjs';

type IImage = HTMLImageElement | ImageData | HTMLCanvasElement | HTMLVideoElement;

const crop = (img: tf.Tensor3D) => {
  const size = Math.min(img.shape[0], img.shape[1]);
  const centerHeight = img.shape[0] / 2;
  const beginHeight = centerHeight - (size / 2);
  const centerWidth = img.shape[1] / 2;
  const beginWidth = centerWidth - (size / 2);
  return img.slice([beginHeight, beginWidth, 0], [size, size, 3]);
}

// convert pixel data into a tensor
const processImage = async (img: IImage | string, dims: [number, number]): Promise<tf.Tensor3D> => {
  if (!img) {
    throw new Error('You must provide an image');
  }
  if (!dims || dims.length === 2) {
    throw new Error('You must provide valid dimensions by which to process');
  }
  return tf.tidy(() => {
    const pixels = tf.fromPixels(getImage(img));
    const croppedImage = crop(tf.image.resizeBilinear(pixels, dims));
    return croppedImage.expandDims(0).toFloat().div(tf.scalar(127)).sub(tf.scalar(1));
  });
};

const getImage = (src: IImage | string): (HTMLImageElement | ImageData | HTMLCanvasElement | HTMLVideoElement) => {
  if (typeof src === 'string') {
    const image = new Image();
    image.src = src;
    return image;
  }
  return src;
}

export default processImage;
