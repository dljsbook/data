import log from './log';

interface IPrintProps {
  invert?: boolean;
}

class Image {
  private label: number;
  private data: any;
  private size: number;
  private canvas: any;
  private dataURL: string;
  private name: string;

  constructor(data, label, size, { name }) {
    this.data = data;
    this.label = label;
    this.size = size;
    this.name = name;
  }

  print(target: HTMLElement | undefined, { invert }: IPrintProps) {
    if (!this.dataURL) {
      if (!this.canvas) {
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.size;
        this.canvas.height = this.size;
      }
      const ctx = this.canvas.getContext('2d');

      const data = this.data.dataSync();
      const pixelValues = [];
      for (let i = 0; i < data.length; i++) {
        const pixel = invert ? 255 - data[i] : data[i];
        pixelValues.push(pixel, pixel, pixel, 255);
      }
      const a = new Uint8ClampedArray(pixelValues);

      const imageData = new ImageData(a, this.size, this.size);
      ctx.putImageData(imageData, 0, 0);
      this.dataURL = this.canvas.toDataURL('image/png');
    }

    log(this.dataURL, { target, name: this.name });
  }
}

export default Image;
