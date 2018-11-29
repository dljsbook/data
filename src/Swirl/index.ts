import NonLinear, {
  INonLinearProps,
  POLARITY,
} from '../NonLinear';

import {
  positiveGenerator,
  negativeGenerator,
} from './generator';

class Swirl extends NonLinear {
  constructor(props: INonLinearProps) {
    super(props);

    this.setName('Swirl');
    this.registerGenerator(POLARITY.POS, positiveGenerator);
    this.registerGenerator(POLARITY.NEG, negativeGenerator);
  }
}

export default Swirl;

export { POLARITY } from '../NonLinear';

