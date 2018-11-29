import NonLinear, {
  INonLinearProps,
  POLARITY,
} from '../NonLinear';

import {
  positiveGenerator,
  negativeGenerator,
} from './generator';

class Clusters extends NonLinear {
  constructor(props: INonLinearProps) {
    super(props);

    this.setName('Clusters');
    this.registerGenerator(POLARITY.POS, positiveGenerator);
    this.registerGenerator(POLARITY.NEG, negativeGenerator);
  }
}

export default Clusters;

export { POLARITY } from '../NonLinear';


