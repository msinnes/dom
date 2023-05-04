import { abstract, abstractMethod } from '@internal/oop';

import { Timer } from './Timer';

const Timers = abstract(class {
  nextId = 1;
  ids = [];
  timers = [];

  constructor() {
    abstractMethod(this, 'getExpired');
    abstractMethod(this, 'getNext');
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

  set(...args) {
    const id = this.nextId++;
    this.ids.push(id);
    this.timers.push(this.create(...args));
    return id;
  }

  tick() {
    this.each(timer => timer.tick());
  }
});

export { Timers };
