import {
  ITable,
  IOptions,
} from './types';
let tfvis;
try {
  tfvis = require('@tensorflow/tfjs-vis');
} catch(err) {
}

type IProps = (data: ITable, props?: IOptions) => void;

const buildRow = (data: any[]) => {
  console.log('data', data);
  const row = document.createElement('tr');
  data.forEach(d => {
    console.log('d', d);
    const td = document.createElement('td');
    td.innerHTML = d;
    row.appendChild(td);
  });
  return row;
};

const buildTable = data => {
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const keys = Object.keys(data[0]);
  thead.appendChild(buildRow(keys));
  const tbody = document.createElement('tbody');
  tbody.appendChild(buildRow(data.map(d => {
    return keys.map(k => d[k]);
  })));

  table.appendChild(thead);
  table.appendChild(tbody);
  return table;
};

const logTable: IProps = (data, { name, target } = {}) => {
  if (target) {
    target.append(buildTable(data));
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
