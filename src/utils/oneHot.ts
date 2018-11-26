import * as tf from '@tensorflow/tfjs';

const oneHot = (labels: number[], classes: number) => tf.tidy(() => tf.oneHot(tf.tensor1d(labels).toInt(), classes));

export default oneHot;
