import * as vega from 'vega';

type IScatterPoint = {
  x: number;
  y: number;
  color: any;
};

interface ISchemaProps {
  width: number;
  height: number;
  values?: any;
  showAxes: boolean;
  marks?: any[];
}

const schema = ({ width, height, values, showAxes, marks }: ISchemaProps) => ({
  "$schema": "https://vega.github.io/schema/vega/v4.json",
  width,
  height,
  "padding": 5,

  "data": [{
    "name": "source",
    values,
  }],

  "scales": [
    // {
    //   "name": "x",
    //   "type": 'linear',
    //   "round": true,
    //   "nice": true,
    //   "zero": true,
    //   "domain": {"data": "source", "field": "x"},
    //   "range": "width"
    // },
    // {
    //   "name": "y",
    //   "type": 'linear',
    //   "round": true,
    //   "nice": true,
    //   "zero": true,
    //   "domain": {"data": "source", "field": "y"},
    //   "range": "height"
    // }
  ],

  ...(showAxes !== false ? {
    "axes": [
      {
        "scale": "x",
        "grid": true,
        "domain": false,
        "orient": ('bottom' as vega.AxisOrient),
        "tickCount": 5,
      },
      {
        "scale": "y",
        "grid": true,
        "domain": false,
        "orient": ('left' as vega.AxisOrient),
      }
    ],
  } : {}),

  "marks": marks || [
    {
      "name": "marks",
      "type": "symbol",
      "from": {"data": "source"},
      "encode": {
        "update": {
          "x": {"scale": "x", "field": "x"},
          "y": {"scale": "y", "field": "y"},
          "shape": {"value": "circle"},
          "strokeWidth": {"value": 2},
          "opacity": {"value": 0.5},
          "stroke": {"field": "stroke"},
          "fill": {"field": "fill"}
        }
      }
    }
  ]
});

const makeImage = async (points: IScatterPoint[], width: number, height: number, options: any) => {
  const values = points.map(value => ({
    ...value,
    stroke: value.color,
    fill: value.color,
    // fill: value.color.fade(0.5),
  }));
  const view = new vega.View(vega.parse(schema({
    width,
    height,
    values,
    ...options,
  }))).renderer('none').initialize();
  return await view.toImageURL('png');
};

const makeScatter = async (points: IScatterPoint[], width: number, height: number, options: any = {}) => {
  const img = await makeImage(points, width, height, options);
  return img;
}

export default makeScatter;
