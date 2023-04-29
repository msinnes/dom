import { Timers } from './Timers';

class Intervals extends Timers {
  getExpired() {
    const results = [];
    this.each(timer => {
      if (timer.remaining <= 0) {
        results.push(timer);
        timer.elapsed -= timer.wait;
      }
    });
    return results;
  }

  getNext() {
    let next;
    this.each(timer => {
      if ((!next && timer.remaining <= 0) || (next && next.wait > timer.wait)) {
        next = timer;
      }
    });
    if (next) {
      next.elapsed -= next.wait;
    }
    return next;
  }
}

export { Intervals };
