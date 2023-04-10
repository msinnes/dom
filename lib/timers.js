let setTimeoutOriginal;
let clearIntervalOriginal;
let timeouts;

class Timeouts {
  id = 1;
  ids = [];
  timeouts = [];
  timeoutMap = {};

  clearInterval(id) {
    const fn = this.timeoutMap[`${id}`];
    const idx = this.timeouts.indexOf(fn);
    if (fn && idx >= 0) {
      this.removeAt(idx);
    }
  }

  next() {
    const id = this.ids.shift();
    if (id) delete this.timeoutMap[`${id}`];
    return this.timeouts.shift();
  }

  removeAt(idx) {
    this.ids = [
      ...this.ids.slice(0, idx),
      ...this.ids.slice(idx + 1),
    ];
    this.timeouts = [
      ...this.timeouts.slice(0, idx),
      ...this.timeouts.slice(idx + 1),
    ];
  }

  run() {
    const fn = this.next();
    fn();
  }

  runAll() {
    let curr = this.next();
    while (curr) {
      curr();
      curr = this.next();
    }
  }

  setTimeout(fn) {
    const id = this.id++;
    this.timeouts.push(fn);
    this.ids.push(fn);
    this.timeoutMap[`${id}`] = fn;
    return id;
  }
}

global.useMyTimers = () => {
  setTimeoutOriginal = setTimeout;
  clearIntervalOriginal = clearInterval;

  const timeouts = new Timeouts();
  global.setTimeout = timeouts.setTimeout.bind(timeouts);
  global.clearInterval = timeouts.clearInterval.bind(timeouts);

  return timeouts;
};

global.resetMyTimers = () => {
  global.setTimeout = setTimeoutOriginal;
  global.clearInterval = clearIntervalOriginal;
};
