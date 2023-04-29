class Timer {
  elapsed = 0;

  get remaining() {
    return this.wait - this.elapsed;
  }

  constructor(fn, wait) {
    this.fn = fn;
    this.wait = wait || 0;
  }

  tick() {
    this.elapsed++;
  }
}

export { Timer };
