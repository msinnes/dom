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

  each(cb) {
    let i = 0;
    const len = this.timers.length;
    for(; i < len; i++) {
      cb(this.timers[i], this.ids[i]);
    }
  }

  set(fn, wait) {
    const id = this.nextId++;
    this.ids.push(id);
    this.timers.push(new Timer(fn, wait));
    return id;
  }

  tick() {
    this.each(timer => timer.tick());
  }
});

export { Timers };
