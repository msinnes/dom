import { Timer } from '../base/Timer';

import { Timeouts } from './Timeouts';

class AnimationFrame extends Timer {
  constructor(fn, createdAt) {
    super(fn, 16);
    this.createdAt = createdAt;
  }

  exec() {
    this.fn(this.createdAt + this.wait);
  }
}

class AnimationFrames extends Timeouts {
  ticks = 0;

  create(fn) {
    return new AnimationFrame(fn, this.ticks);
  }

  tick() {
    this.ticks++;
    super.tick();
  }
}

export { AnimationFrame, AnimationFrames };
