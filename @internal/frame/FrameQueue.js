import { Frame } from './Frame';

class FrameQueue {
  frames = [];

  get length() {
    return this.frames.length;
  }

  add(instance, nextState) {
    this.frames.push(new Frame(instance, nextState));
  }

  next() {
    return this.frames.shift();
  }
}

export { FrameQueue };
