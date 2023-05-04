import { Timer } from '../base/Timer';

import { Timeouts } from './Timeouts';

class Immediate extends Timer {
  constructor(fn) {
    super(fn, 0);
  }
}

class Immediates extends Timeouts {
  create(fn) {
    return new Immediate(fn);
  }
}

export { Immediate, Immediates };
