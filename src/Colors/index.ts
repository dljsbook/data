import Color from 'color';
import { COLORS } from "../config";
const DEFAULT_NUM = 2;
const DEFAULT_WIDTH = 50;
const DEFAULT_HEIGHT = 50;
const parsedColors = COLORS.map(c => Color(c).hsl().color);

export enum LABEL {
  BLUE = 0,
  ORANGE = 1,
  PURPLE = 2,
  GREEN = 3,
}

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

const getColors = (num: number = DEFAULT_NUM, labels = DEFAULT_LABELS, options?: IOptions): Color[] => {
  const colors: string[] = [];
  for (let i = 0; i < num; i++) {
    const r = rand(labels.length);
    const label = labels[r];
    colors.push(getColor(label, options));
  }
  return colors;
};

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

const getAsImages = (
  options: IOptions = {},
  num?: number,
  labels?: LABEL[],
): string[] => {
  const colors = getColors(num, labels, options);

  if (!ctx) {
    throw new Error("Your browser could not get context");
  }

  const width = options.width || DEFAULT_WIDTH;
  const height = options.height || DEFAULT_HEIGHT;

  const imgData = ctx.createImageData(width, height);

  return colors.map(color => {
    const [r, g, b] = color.rgb().color;
    for (let i = 0; i < imgData.data.length; i += 4) {
      imgData.data[i + 0] = r;
      imgData.data[i + 1] = g;
      imgData.data[i + 2] = b;
      imgData.data[i + 3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);
    return canvas.toDataURL();
  });
};

class Colors {
  get = (num: number = DEFAULT_NUM, labels?: LABEL[], options?: IOptions) => {
    return getAsImages(options, num, labels);
  };

  getForLabel = (label: LABEL, num?: number, options?: IOptions) => {
    return getAsImages(options, num, [label]);
  };
}

export default Colors;
