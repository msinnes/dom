import { abstract, abstractMethod } from '@internal/oop';

import { Timer } from './Timer';

const Timers = abstract(class {
  nextId = 1;
  ids = [];
  timers = [];

  constructor() {
    abstractMethod(this, 'getExpired');
  }

  clear(id) {
    const idx = this.ids.indexOf(id);
    if (idx >= 0) {
      this.ids = [
        ...this.ids.slice(0, idx),
        ...this.ids.slice(idx + 1),
      ];
      this.timers = [
        ...this.timers.slice(0, idx),
        ...this.timers.slice(idx + 1),
      ];
    }
  }

  create(fn, wait, ...args) {
    return new Timer(fn, wait, args);
  }

  each(cb) {
    let i = 0;
    const len = this.timers.length;
    for(; i < len; i++) {
      cb(this.timers[i], this.ids[i]);
    }
  }

  next() {
    let next;
    this.each((timer) => {
      if ((!next && timer.expired) || (next && timer.isBefore(next))) {
        next = timer;
      }
    });
    return next;
  }

  set(...args) {
    const id = this.nextId++;
    this.ids.push(id);
    const newTimer = this.create(...args);
    newTimer.id = id;
    this.timers.push(newTimer);
    return id;
  }

  tick() {
    this.each(timer => timer.tick());
  }
});

export { Timers };
