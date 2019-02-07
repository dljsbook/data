import * as Color from 'color';
import { COLORS as CONFIG_COLORS } from "../config";
const DEFAULT_NUM = 2;
const DEFAULT_WIDTH = 50;
const DEFAULT_HEIGHT = 50;
const parsedColors = CONFIG_COLORS.map(c => Color(c).hsl().array());

enum LABEL {
  BLUE = 0,
  ORANGE = 1,
  PURPLE = 2,
  GREEN = 3
}

const LABEL_STRINGS = {
  [LABEL.BLUE]: "blue",
  [LABEL.ORANGE]: "orange",
  [LABEL.PURPLE]: "purple",
  [LABEL.GREEN]: "green"
};

interface IRandom {
  h: number;
  s: number;
  l: number;
}

interface IOptions {
  random?: number | IRandom;
  width?: number;
  height?: number;
}

const DEFAULT_LABELS = [LABEL.BLUE, LABEL.ORANGE];

const DEFAULT_RANDOM = {
  h: 5,
  s: 5,
  l: 5
};

const parseRandom = (options: IOptions): IRandom => {
  if (options.random) {
    if (typeof options.random === "number") {
      return {
        h: options.random,
        s: options.random,
        l: options.random
      };
    }
    return options.random;
  }
  return DEFAULT_RANDOM;
};

interface IParsedOptions {
  random: IRandom;
}

const parseOptions = (options: IOptions): IParsedOptions => {
  return {
    random: parseRandom(options)
  };
};

const getRandomValue = (val: number, random: number) => {
  return val + Math.random() * random - random / 2;
};

const getColor = (label: LABEL, options: IOptions = {}): Color => {
  const [h, s, l] = parsedColors[label];
  const { random } = parseOptions(options);
  return Color.hsl(
    getRandomValue(h, random.h),
    getRandomValue(s, random.s),
    getRandomValue(l, random.l)
  );
};

const rand = (max: number) => Math.floor(Math.random() * max);

interface IColor {
  color: Color;
  label: string;
}

interface IColorData {
  data: string;
  label: string;
}

const getColors = (num: number, labels: LABEL[], options?: IOptions): IColor[] => {
const colors: IColor[] = [];
  for (let i = 0; i < num; i++) {
    const r = rand(labels.length);
    const label = labels[r];
    colors.push({
      label: LABEL_STRINGS[label],
      color: getColor(label, options)
    });
  }
  return colors;
};

interface IData {
  data: string[];
  labels: string[];
}

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

const getAsImages = (
  options: IOptions = {},
  num: number = DEFAULT_NUM,
  labels: LABEL[] = DEFAULT_LABELS,
): IData => {
  const colors = getColors(num, labels, options);

  if (!ctx) {
    throw new Error("Your browser could not get context");
  }

  const width = options.width || DEFAULT_WIDTH;
  const height = options.height || DEFAULT_HEIGHT;

  const imgData = ctx.createImageData(width, height);

  return colors.map(({ color, label }) => {
    const [r, g, b] = color.rgb().array();
    for (let i = 0; i < imgData.data.length; i += 4) {
      imgData.data[i + 0] = r;
      imgData.data[i + 1] = g;
      imgData.data[i + 2] = b;
      imgData.data[i + 3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);
    return {
      data: canvas.toDataURL(),
      label,
    };
  }).reduce(({ data, labels }, color: IColorData) => ({
    data: data.concat(color.data),
    labels: labels.concat(color.label),
  }), { data: [], labels: [] } as IData);
};

class Colors {
  get = (num: number = DEFAULT_NUM, labels?: LABEL[], options?: IOptions) => {
    return getAsImages(options, num, labels);
  };

  getForLabel = (label: LABEL, num?: number, options?: IOptions) => {
    return getAsImages(options, num, [label]).data;
  };
}

export default Colors;
