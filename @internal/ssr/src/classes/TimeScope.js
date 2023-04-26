class Timeout {
  elapsed = 0;

  get remaining() {
    let difference = this.wait - this.elapsed;
    if (difference < 0) difference = 0;
    return difference;
  }

  constructor(fn, wait) {
    this.fn = fn;
    this.wait = wait || 0;
  }

  tick() {
    this.elapsed++;
  }
}

class Timeouts {
  currentId = 1;
  ids = [];
  timeouts = [];

  clear(id) {
    const idx = this.ids.indexOf(id);
    if (idx >= 0) {
      this.ids = [
        ...this.ids.slice(0, idx),
        ...this.ids.slice(idx + 1),
      ];
      this.timeouts = [
        ...this.timeouts.slice(0, idx),
        ...this.timeouts.slice(idx + 1),
      ];
    }
  }

  each(cb) {
    let i = 0;
    const len = this.timeouts.length;
    for(; i < len; i++) {
      cb(this.timeouts[i], this.ids[i]);
    }
  }

  process() {
    const remove = [];
    this.each((timeout, id) => {
      if (!timeout.remaining) {
        timeout.fn();
        remove.push(id);
      }
    });
    remove.forEach(id => this.clear(id));
  }

  set(fn, wait) {
    const id = this.currentId++;
    this.ids.push(id);
    this.timeouts.push(new Timeout(fn, wait));
    return id;
  }

  tick() {
    this.each(timeout => timeout.tick());
  }
}

const setTimeoutOriginal = setTimeout;
const clearTimeoutOriginal = clearTimeout;

class TimeScope {
  timeouts = new Timeouts();

  disable() {
    setTimeout = setTimeoutOriginal;
    clearTimeout = clearTimeoutOriginal;
  }

  enable() {
    setTimeout = this.timeouts.set.bind(this.timeouts);
    clearTimeout = this.timeouts.clear.bind(this.timeouts);
  }

  play(ticks = 1) {
    if (ticks <= 0) return;
    let i = 0;
    let len = ticks;
    while(i < len) {
      this.timeouts.tick();
      this.timeouts.process();
      i++;
    }
  }

  run() {
    this.timeouts.process();
  }
}

export { Timeout, Timeouts, TimeScope };
