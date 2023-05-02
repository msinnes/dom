import { isDefined } from '@internal/is';

import { DigestibleScope } from '../base/DigestibleScope';

import { Intervals } from './Intervals';
import { Timeouts } from './Timeouts';

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
    const nextInterval = this.intervals.getNext();
    const nextTimeout = this.timeouts.getNext();

    if (nextInterval && nextTimeout) return (nextInterval.remaining < nextTimeout.remaining) ? nextInterval : nextTimeout;
    if (nextInterval) return nextInterval;
    if (nextTimeout) return nextTimeout;
  }

  tick() {
    this.timeouts.tick();
    this.intervals.tick();
  }
}

export { TimeScope };
