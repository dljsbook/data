import {
  ITable,
  IOptions,
} from './types';
// import tfvis from '@tensorflow/tfjs-vis';

type IProps = (data: ITable, props: IOptions) => void;

const buildRow = (data: any[], tag: string = 'td') => {
  const row = document.createElement('tr');
  data.forEach(d => {
    const td = document.createElement(tag);
    td.innerHTML = d;
    row.appendChild(td);
  });
  return row;
};

const buildTable = (data: ITable) => {
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const keys = Object.keys(data[0]);
  thead.appendChild(buildRow(keys, 'th'));
  const tbody = document.createElement('tbody');
  const rows = data.map(d => keys.map(k => d[k]));
  rows.forEach(row => {
    tbody.appendChild(buildRow(row));
  })

  table.appendChild(thead);
  table.appendChild(tbody);
  return table;
};

const logTable: IProps = (data, { name, target } = {}) => {
  if (target) {
    target.appendChild(buildTable(data));
  // } else if (tfvis) {
  //   const surface = tfvis.visor().surface({
  //     name: name || 'Table',
  //     tab: 'Console',
  //   });
  //   const headers = Object.keys(data[0]);
  //   const values = data.map(row => headers.map(header => row[header]));
  //   tfvis.render.table({
  //     headers,
  //     values,
  //   }, surface);
  } else {
    console.table(data);
  }
}

export default logTable;
