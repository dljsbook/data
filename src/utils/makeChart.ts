import { Chart } from 'chart.js';

export type IPoint = { x: number, y: number };

const makeImage = (data: any, width: number, height: number) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const chart = new Chart(canvas, data);
  const img = chart.toBase64Image();
  chart.destroy();
  return img;
};

const makeChart = (data: any, width: number, height: number) => {
  const img = makeImage(data, width, height);
  return img;
}

export default makeChart;
