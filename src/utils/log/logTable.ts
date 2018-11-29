import * as tfvis from '@tensorflow/tfjs-vis';
import {
  ITable,
  IOptions,
} from './types';

type IProps = (data: ITable, props?: IOptions) => void;

const logTable: IProps = (data, { name, target } = {}) => {
  if (target) {
    target.append(JSON.stringify(data));
  } else if (tfvis) {
    const surface = tfvis.visor().surface({
      name: name || 'Table',
      tab: 'Console',
    });
    const headers = Object.keys(data[0]);
    const values = data.map(row => headers.map(header => row[header]));
    tfvis.render.table({
      headers,
      values,
    }, surface);
  } else {
    console.table(data);
  }
}

export default logTable;
