import { Timer } from '../base/Timer';
import { Timers } from '../base/Timers';

class Interval extends Timer {
  ticks = 0;
  lastRun = null;

  get ran() {
    return this.lastRun === this.ticks;
  }

  exec() {
    this.lastRun = this.ticks;
    super.exec();
  }

  tick() {
    this.ticks++;
    super.tick();
  }
}

class Intervals extends Timers {
  create(fn, wait, ...args) {
    return new Interval(fn, wait, args);
  }

  getExpired() {
    const results = [];
    this.each(timer => {
      if (timer.expired && !timer.ran) {
        results.push(timer);
        timer.elapsed -= (timer.wait || 1);
      }
    });
    return results;
  }

  getNext() {
    let next;
    this.each(timer => {
      if ((!next && timer.expired && !timer.ran) || (next && timer.isBefore(next) && !timer.ran)) {
        next = timer;
      }
    });
    if (next) {
      next.elapsed -= (next.wait || 1);
    }
    return next;
  }
}

export { Interval, Intervals };
