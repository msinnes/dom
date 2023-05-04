// TODO: abstract this out
class Timer {
  elapsed = 0;

  get expired() {
    return this.remaining <= 0;
  }

  get remaining() {
    return this.wait - this.elapsed;
  }

  constructor(fn, wait) {
    this.fn = fn;
    this.wait = wait || 0;
  }

  exec() {
    this.fn();
  }

  isBefore(timer) {
    return this.remaining < timer.remaining;
  }

  tick() {
    this.elapsed++;
  }
}

export { Timer };
