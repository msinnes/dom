class Timer {
  elapsed = 0;
  ranThisTick = false;

  get remaining() {
    return this.wait - this.elapsed;
  }

  constructor(fn, wait) {
    this.fn = () => {
      this.ranThisTick = true;
      fn();
    };
    this.wait = wait || 0;
  }

  tick() {
    this.ranThisTick = false;
    this.elapsed++;
  }
}

export { Timer };
