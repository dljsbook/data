import NonLinear, {
  INonLinearProps,
  POLARITY,
} from '../NonLinear';

import {
  positiveGenerator,
  negativeGenerator,
} from './generator';

class Circles extends NonLinear {
  constructor(props: INonLinearProps) {
    super(props);

    this.setName('Circles');
    this.registerGenerator(POLARITY.POS, positiveGenerator);
    this.registerGenerator(POLARITY.NEG, negativeGenerator);
  }
}

export default Circles;

export { POLARITY } from '../NonLinear';
