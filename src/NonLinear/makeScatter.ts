import makeChart from '../utils/makeChart';

type IColor = {
  r: { value: string };
  g: { value: string };
  b: { value: string };
}

type IScatterPoint = {
  x: number;
  y: number;
  color: string | IColor;
};

const getData = (data: IScatterPoint[], options: any = {}) => ({
  type: 'scatter',
  data: {
    datasets: [{
      data,
      pointBackgroundColor: data.map(({ color }) => color),
      pointBorderColor: data.map(({ color }) => color),
      pointRadius: 5,
      fill: false,
      fillColor: 'red',
    }]
  },
  options: {
    animation: {
      duration: 0,
    },
    responsive: false,
    scales: {
      yAxes: [{
        display: true,
      }],
      xAxes: [{
        type: 'linear',
      }],
    },
    legend: {
      display: false,
    },
  },
  ...options,
});

const makeScatter = (points: IScatterPoint[], width: number, height: number, options?: any) => {
  return makeChart(getData(points, options), width, height);
}

export default makeScatter;
