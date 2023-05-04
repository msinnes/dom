import { isDefined } from '@internal/is';

import { DigestibleScope } from '../base/DigestibleScope';

import { Immediates } from './timers/Immediates';
import { Intervals } from './timers/Intervals';
import { Timeouts } from './timers/Timeouts';

const setTimeoutOriginal = setTimeout;
const clearTimeoutOriginal = clearTimeout;
const setIntervalOriginal = setInterval;
const clearIntervalOriginal = clearInterval;
const setImmediateOriginal = setImmediate;
const clearImmediateOriginal = clearImmediate;

class TimeScope extends DigestibleScope {
  runExpiredTimers = true;
  immediates = new Immediates();
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
    setImmediate = setImmediateOriginal;
    clearImmediate = clearImmediateOriginal;
    setTimeout = setTimeoutOriginal;
    clearTimeout = clearTimeoutOriginal;
    setInterval = setIntervalOriginal;
    clearInterval = clearIntervalOriginal;
  }

  enable() {
    setImmediate = this.immediates.set.bind(this.immediates);
    clearImmediate = this.immediates.clear.bind(this.immediates);
    setTimeout = this.timeouts.set.bind(this.timeouts);
    clearTimeout = this.timeouts.clear.bind(this.timeouts);
    setInterval = this.intervals.set.bind(this.intervals);
    clearInterval = this.intervals.clear.bind(this.intervals);
  }

  getExpiredTimers() {
    return [
      ...this.immediates.getExpired(),
      ...this.timeouts.getExpired(),
      ...this.intervals.getExpired(),
    ].sort((a, b) => a.remaining - b.remaining);
  }

  getNextTimer() {
    const nextTimers = [
      this.immediates.getNext(),
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
    this.immediates.tick();
    this.timeouts.tick();
    this.intervals.tick();
  }
}

export { TimeScope };
