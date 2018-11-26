import * as vega from 'vega';

type IPoints = {
  width: number;
  height: number;
  color: any;
}[];

const schema = ({ width, height, values }) => ({
  "$schema": "https://vega.github.io/schema/vega/v4.json",
  width,
  height,
  "padding": 5,

  "data": [{
    "name": "source",
    values,
  }],

  "scales": [
    {
      "name": "x",
      "type": "linear",
      "round": true,
      "nice": true,
      "zero": true,
      "domain": {"data": "source", "field": "x"},
      "range": "width"
    },
    {
      "name": "y",
      "type": "linear",
      "round": true,
      "nice": true,
      "zero": true,
      "domain": {"data": "source", "field": "y"},
      "range": "height"
    }
  ],

  "axes": [
    {
      "scale": "x",
      "grid": true,
      "domain": false,
      "orient": "bottom",
      "tickCount": 5,
    },
    {
      "scale": "y",
      "grid": true,
      "domain": false,
      "orient": "left",
    }
  ],


  "marks": [
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

const makeImage = async (points: IPoints, width: number, height: number) => {
  const values = points.map(value => ({
    ...value,
    stroke: value.color,
    fill: value.color.fade(0.5),
  }));
  const view = new vega.View(vega.parse(schema({
    width,
    height,
    values,
  }))).renderer('none').initialize();
  return await view.toImageURL('png');
};

const makeScatter = async (points: IPoints, width: number, height: number) => {
  const img = await makeImage(points, width, height);
  return img;
}

export default makeScatter;
