class Frame {
  constructor(instance, nextState) {
    this.instance = instance;
    this.nextState = nextState;
  }

  write() {
    this.instance.writeState(this.nextState);
  }
}

export { Frame };