// import * as tf from '@tensorflow/tfjs';
import oneHot from './utils/oneHot';

import {
  DATAROOT,
} from './config';

interface IProps {
  numberOfClasses?: number;
}

class Dataset {
  private callbacks: Function[] = [];
  protected loaded: boolean = true;
  protected numberOfClasses?: number;

  constructor(props: IProps = {}) {
    this.numberOfClasses = props.numberOfClasses;
  }

  oneHot = (labelIndex: number|number[]|Uint8Array, classLength?: number) => {
    const numberOfClasses: number = classLength || this.numberOfClasses || 0;
    if (numberOfClasses <= 1) {
      throw new Error('You must provide more than 1 class to oneHot');
    }

    if (typeof labelIndex === 'number') {
      return oneHot([labelIndex], numberOfClasses);
    }

    return oneHot((labelIndex as any), numberOfClasses);
  }

  ready = (fn = () => {}) => new Promise(resolve => {
    if (this.loaded) {
      fn();
      return resolve();
    }

    this.callbacks.push(() => {
      fn();
      return resolve();
    });
  });

  loadFromURL = async (url: string, method: string = 'arrayBuffer') => {
    const resp = await fetch(`${DATAROOT}${url}`);
    if (typeof method === 'string' && !resp[method]) {
      throw new Error(`Method ${method} does not exist on response`);
    }
    if (method === 'arrayBuffer') {
      const buff = await resp.arrayBuffer();
      return new Uint8Array(buff);
    }

    // if (typeof method === 'string') {
    //   return await resp[method]();
    // }

    return await resp[method]();
    // return method(resp);
  }

  load = async (fn?: () => void) => {
    this.loaded = false;
    if (fn) {
      await fn();
    }
    this.loaded = true;

    this.callbacks.forEach(fn => fn());
    this.callbacks = [];
  }
}

export default Dataset;
