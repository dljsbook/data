import * as vega from 'vega';

type IPoints = [number, number][];

const schema = ({ width, height, values }) => ({
  "$schema": "https://vega.github.io/schema/vega/v4.json",
  width,
  height,
  "padding": 5,
  "data": [
    {
      "name": "table",
      values,
    }
  ],
  "scales": [
    {
      "name": "x",
      "type": "point",
      "range": "width",
      "domain": {"data": "table", "field": "x"}
    },
    {
      "name": "y",
      "type": "linear",
      "range": "height",
      "nice": true,
      "zero": true,
      "domain": {"data": "table", "field": "y"}
    }
  ],

  "axes": [
    {"orient": "bottom", "scale": "x"},
    {"orient": "left", "scale": "y"}
  ],

  "marks": [
    {
      "type": "group",
      "from": {
        "facet": {
          "name": "series",
          "data": "table",
          "groupby": "c"
        }
      },
      "marks": [
        {
          "type": "line",
          "from": {"data": "series"},
          "encode": {
            "enter": {
              "x": {"scale": "x", "field": "x"},
              "y": {"scale": "y", "field": "y"},
              "strokeWidth": {"value": 2}
            }
          }
        }
      ]
    }
  ]
});

const makeImage = async (points: IPoints, width: number, height: number) => {
  const view = new vega.View(vega.parse(schema({
    width,
    height,
    values: points.map(([x, y]) => ({
      x,
      y,
    })),
  }))).renderer('none').initialize();
  return await view.toImageURL('png');
};

const makeChart = async (points: IPoints, width: number, height: number) => {
  const img = await makeImage(points, width, height);
  return img;
}

export default makeChart;
