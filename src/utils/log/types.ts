export type ITable = {
  [index: string]: string|number|null|undefined;
}[];

export interface IOptions {
  width?: number;
  height?: number;

  name?: string;
  target?: HTMLElement;
}
