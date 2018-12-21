export enum POLARITY {
  POS,
  NEG,
}

export type IPoint = {
  x: number;
  y: number;
};

export type IGetX = (range: IRange) => number;

export type IGeneratorProps = {
  noise: number;
  getX: IGetX;
  num: number;
  step: number;
}

export type IRange = [number, number];

export type IGeneratorFn = (range: IRange, props: IGeneratorProps) => IPoint;
