import logImage from './logImage';
import logTable from './logTable';

import {
  ITable,
  IOptions,
} from './types';

function log(data: string|ITable, options: IOptions) {
  if (typeof data === 'string') {
    logImage(data, options);
  }
  if (Array.isArray(data)) {
    logTable(data, options);
  }
}

export default log;
