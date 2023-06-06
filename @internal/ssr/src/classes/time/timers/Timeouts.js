import { Timer } from '../base/Timer';
import { Timers } from '../base/Timers';

class Timeout extends Timer {}

class Timeouts extends Timers {
  create(fn, wait, ...args) {
    return new Timeout(fn, wait, args);
  }

  getExpired() {
    const remove = [];
    const results = [];
    this.each((timer, id) => {
      if (timer.expired) {
        results.push(timer);
        remove.push(id);
      }
    });
    remove.forEach(id => this.clear(id));
    return results;
  }

  getNext() {
    let next;
    let nextId;
    this.each((timer, id) => {
      if ((!next && timer.expired) || (next && timer.isBefore(next))) {
        next = timer;
        nextId = id;
      }
    });
    if (next) {
      this.clear(nextId);
    }
    return next;
  }
}

export { Timeout, Timeouts };
