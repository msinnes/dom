class Frame {
  constructor(instance, nextState) {
    this.instance = instance;
    this.nextState = nextState;
  }

  write() {
    this.instance.writeState(this.nextState);
  }
}

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

export { Frame, FrameQueue };