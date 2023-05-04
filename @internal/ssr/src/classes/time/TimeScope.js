import { isDefined } from '@internal/is';

import { DigestibleScope } from '../base/DigestibleScope';

import { Intervals } from './timers/Intervals';
import { Timeouts } from './timers/Timeouts';

const setTimeoutOriginal = setTimeout;
const clearTimeoutOriginal = clearTimeout;
const setIntervalOriginal = setInterval;
const clearIntervalOriginal = clearInterval;

class TimeScope extends DigestibleScope {
  runExpiredTimers = true;
  intervals = new Intervals();
  timeouts = new Timeouts();

  constructor(config) {
    super();
    if (isDefined(config.runExpiredTimers)) this.runExpiredTimers = config.runExpiredTimers;
  }

  digest() {
    if (this.runExpiredTimers) return this.getExpiredTimers();
    return [];
  }

  disable() {
    setTimeout = setTimeoutOriginal;
    clearTimeout = clearTimeoutOriginal;
    setInterval = setIntervalOriginal;
    clearInterval = clearIntervalOriginal;
  }

  enable() {
    setTimeout = this.timeouts.set.bind(this.timeouts);
    clearTimeout = this.timeouts.clear.bind(this.timeouts);
    setInterval = this.intervals.set.bind(this.intervals);
    clearInterval = this.intervals.clear.bind(this.intervals);
  }

  getExpiredTimers() {
    return [
      ...this.timeouts.getExpired(),
      ...this.intervals.getExpired(),
    ].sort((a, b) => a.remaining - b.remaining);
  }

  getNextTimer() {
    const nextTimers = [
      this.timeouts.getNext(),
      this.intervals.getNext(),
    ];

    let next;
    nextTimers.forEach(timer => {
      // This timer.isBefore(next) call needs to be nested
      if (next && timer) next = timer.isBefore(next) ? timer : next;
      else if (timer) next = timer;
    });
    return next;
  }

  tick() {
    this.timeouts.tick();
    this.intervals.tick();
  }
}

export { TimeScope };
