import { isDefined } from '@internal/is';

import { DigestibleScope } from '../base/DigestibleScope';

import { AnimationFrame, AnimationFrames } from './timers/AnimationFrames';
import { Interval, Intervals } from './timers/Intervals';
import { Timeout, Timeouts } from './timers/Timeouts';

const setTimeoutOriginal = global.setTimeout;
const clearTimeoutOriginal = global.clearTimeout;
const setIntervalOriginal = global.setInterval;
const clearIntervalOriginal = global.clearInterval;

class TimeScope extends DigestibleScope {
  digestExpiredTimers = true;
  animationFrames = new AnimationFrames();
  intervals = new Intervals();
  timeouts = new Timeouts();

  constructor(config) {
    super();
    if (isDefined(config.digestExpiredTimers)) this.digestExpiredTimers = config.digestExpiredTimers;
  }

  digest() {
    if (this.digestExpiredTimers) return this.getAll();
    return [];
  }

  disable() {
    global.setTimeout = setTimeoutOriginal;
    global.clearTimeout = clearTimeoutOriginal;
    global.setInterval = setIntervalOriginal;
    global.clearInterval = clearIntervalOriginal;
    delete global.requestAnimationFrame;
    delete global.cancelAnimationFrame;
  }

  enable() {
    global.setTimeout = this.timeouts.set.bind(this.timeouts);
    global.clearTimeout = this.timeouts.clear.bind(this.timeouts);
    global.setInterval = this.intervals.set.bind(this.intervals);
    global.clearInterval = this.intervals.clear.bind(this.intervals);
    global.requestAnimationFrame = this.animationFrames.set.bind(this.animationFrames);
    global.cancelAnimationFrame = this.animationFrames.clear.bind(this.animationFrames);
  }

  getAll() {
    return [
      ...this.timeouts.getExpired(),
      ...this.intervals.getExpired(),
      ...this.animationFrames.getExpired(),
    ].sort((a, b) => a.remaining - b.remaining);
  }

  getNext() {
    const nextTimers = [
      this.timeouts.next(),
      this.intervals.next(),
      this.animationFrames.next(),
    ];

    let next;
    nextTimers.forEach(timer => {
      // This timer.isBefore(next) call needs to be nested
      if (next && timer) next = timer.isBefore(next) ? timer : next;
      else if (timer) next = timer;
    });

    if (next instanceof Timeout) this.timeouts.clear(next.id);
    if (next instanceof AnimationFrame) this.animationFrames.clear(next.id);
    if (next instanceof Interval) next.elapsed -= (next.wait || 1);
    return next;
  }

  tick() {
    this.timeouts.tick();
    this.intervals.tick();
    this.animationFrames.tick();
  }
}

export { TimeScope };
