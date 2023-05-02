import { Timers } from './Timers';

class Timeouts extends Timers {
  getExpired() {
    const remove = [];
    const results = [];
    this.each((timer, id) => {
      if (timer.remaining <= 0) {
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
      if ((!next && timer.remaining <= 0) || (next && next.wait > timer.wait)) {
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

export { Timeouts };
