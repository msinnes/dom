import { isDefined } from '@internal/is';

class Timeout {
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

  getExpired() {
    const remove = [];
    const results = [];
    this.each((timeout, id) => {
      if (!timeout.remaining) {
        results.push(timeout);
        remove.push(id);
      }
    });
    remove.forEach(id => this.clear(id));
    return results;
  }

  getNext() {
    let next;
    let nextId;
    this.each((timeout, id) => {
      if (!next || next.wait > timeout.wait) {
        next = timeout;
        nextId = id;
      }
    });
    if (next) {
      this.clear(nextId);
    }
    return next;
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
  runExpiredTimers = true;
  timeouts = new Timeouts();

  constructor(config) {
    if (isDefined(config.runExpiredTimers)) this.runExpiredTimers = config.runExpiredTimers;
  }

  digest() {
    if (this.runExpiredTimers) return this.getExpiredTimers();
    return [];
  }

  disable() {
    setTimeout = setTimeoutOriginal;
    clearTimeout = clearTimeoutOriginal;
  }

  enable() {
    setTimeout = this.timeouts.set.bind(this.timeouts);
    clearTimeout = this.timeouts.clear.bind(this.timeouts);
  }

  getExpiredTimers() {
    return [
      ...this.timeouts.getExpired(),
    ];
  }

  getNextTimer() {
    return this.timeouts.getNext();
  }

  tick() {
    this.timeouts.tick();
  }
}

export { Timeout, Timeouts, TimeScope };
