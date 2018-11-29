import NonLinear, {
  INonLinearProps,
  POLARITY,
} from '../NonLinear';

import {
  positiveGenerator,
  negativeGenerator,
} from './generator';

class Moons extends NonLinear {
  constructor(props: INonLinearProps) {
    super(props);

    this.setName('Moons');
    this.registerGenerator(POLARITY.POS, positiveGenerator);
    this.registerGenerator(POLARITY.NEG, negativeGenerator);
  }
}

export default Moons;

export { POLARITY } from '../NonLinear';
