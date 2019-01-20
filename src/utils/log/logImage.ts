import {
  IOptions,
} from './types';
// import tfvis from '@tensorflow/tfjs-vis';

type IProps = (src: string, props: IOptions) => void;

const logImage: IProps = (src, { width, height, name, target } = {}) => {
  const img = new Image();
  img.src = src;
  img.onload = () => {
    if (!width) {
      width = img.width;
    }
    if (!height) {
      height = img.height;
    }
    const style = {
      'font-size': '1px',
      padding: `${height * .5}px ${width * .5}px`,
      'background-image': `url(${src})`,
      height: `${height}px`,
      width: `${width}px`,
      display: 'block',
      color: 'transparent',
    };

    if (target) {
      target.appendChild(img);
    // } else if (tfvis) {
    //   const surface = tfvis.visor().surface({
    //     name: name || 'Image',
    //     tab: 'Console',
    //   });
    //   surface.drawArea.appendChild(img);
    } else {
      console.log('%c ', Object.keys(style).map(key => `${key}: ${style[key]}`).join(';'));
    }
  }
}

export default logImage;

