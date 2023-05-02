import { Timers } from './Timers';

class Intervals extends Timers {
  getExpired() {
    const results = [];
    this.each(timer => {
      if (timer.remaining <= 0 && !timer.ranThisTick) {
        results.push(timer);
        timer.elapsed -= (timer.wait || 1);
      }
    });
    return results;
  }

  getNext() {
    let next;
    this.each(timer => {
      if ((!next && timer.remaining <= 0 && !timer.ranThisTick) || (next && next.wait > timer.wait && !timer.ranThisTick)) {
        next = timer;
      }
    });
    if (next) {
      next.elapsed -= (next.wait || 1);
    }
    return next;
  }
}

export { Intervals };
