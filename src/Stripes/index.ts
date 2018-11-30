import NonLinear, {
  INonLinearProps,
  POLARITY,
} from '../NonLinear';

import {
  positiveGenerator,
  negativeGenerator,
} from './generator';

class Stripes extends NonLinear {
  constructor(props: INonLinearProps) {
    super(props);

    this.setName('Stripes');
    this.registerGenerator(POLARITY.POS, positiveGenerator);
    this.registerGenerator(POLARITY.NEG, negativeGenerator);
  }
}

export default Stripes;

export { POLARITY } from '../NonLinear';


