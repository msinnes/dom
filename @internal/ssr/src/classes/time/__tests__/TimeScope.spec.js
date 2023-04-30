import { DigestibleScope } from '../../base/DigestibleScope';
import { Intervals } from '../Intervals';
import { Timeouts } from '../Timeouts';

import { TimeScope } from '../TimeScope';

describe('TimeScope', () => {
  it('should be a class', () => {
    expect(TimeScope).toBeAClass();
  });


  it('should extends DigestibleScope', () => {
    expect(TimeScope).toExtend(DigestibleScope);
  });

  describe('instance', () => {
    let instance;
    let setTimeoutOriginal;
    let clearTimeoutOriginal;
    let setIntervalOriginal;
    let clearIntervalOriginal;
    beforeEach(() => {
      instance = new TimeScope({});
      setTimeoutOriginal = setTimeout;
      clearTimeoutOriginal = clearTimeout;
      setIntervalOriginal = setInterval;
      clearIntervalOriginal = clearInterval;
    });

    it('should have a timeouts prop', () => {
      expect(instance.timeouts).toBeInstanceOf(Timeouts);
    });

    it('should have an intervals prop', () => {
      expect(instance.intervals).toBeInstanceOf(Intervals);
    });

    it('should have a runExpiredTimers prop defaulted to true', () => {
      expect(instance.runExpiredTimers).toBe(true);
    });

    it('should set runExpiredTimers if a value is passed', () => {
      instance = new TimeScope({ runExpiredTimers: true });
      expect(instance.runExpiredTimers).toBe(true);
      instance = new TimeScope({ runExpiredTimers: false });
      expect(instance.runExpiredTimers).toBe(false);
    });

    describe('digest', () => {
      it('should be a function', () => {
        expect(instance.digest).toBeInstanceOf(Function);
      });

      it('should make a call to instance.getExpiredTimers if runExpiredTimers is true', () => {
        const fn = () => {};
        const getExpiredTimersMock = jest.fn().mockReturnValue([fn]);
        instance.getExpiredTimers = getExpiredTimersMock;
        let results = instance.digest();
        expect(getExpiredTimersMock).toHaveBeenCalledTimes(1);
        expect(results.length).toEqual(1);
        expect(results[0]).toBe(fn);
        instance = new TimeScope({ runExpiredTimers: false });
        instance.run = getExpiredTimersMock;
        results = instance.digest();
        expect(getExpiredTimersMock).toHaveBeenCalledTimes(1);
        expect(results.length).toEqual(0);
      });
    });

    describe('enable', () => {
      it('should be a function', () => {
        expect(instance.enable).toBeInstanceOf(Function);
      });

      it('should reset setTimeout to timers.set', () => {
        instance.enable();
        expect(setTimeout).not.toBe(setTimeoutOriginal);
        const fn = () => {};
        setTimeout(fn);
        expect(instance.timeouts.timers.length).toEqual(1);
        instance.disable();
      });

      it('should set clearTimeout to timers.clear', () => {
        instance.enable();
        expect(clearTimeout).not.toBe(clearTimeoutOriginal);
        const fn = () => {};
        const id = setTimeout(fn);
        expect(instance.timeouts.timers.length).toEqual(1);
        clearTimeout(id);
        expect(instance.timeouts.timers.length).toEqual(0);
        instance.disable();
      });

      it('should reset setInterval to timers.set', () => {
        instance.enable();
        expect(setInterval).not.toBe(setIntervalOriginal);
        const fn = () => {};
        setInterval(fn);
        expect(instance.intervals.timers.length).toEqual(1);
        instance.disable();
      });

      it('should set clearInterval to timers.clear', () => {
        instance.enable();
        expect(clearInterval).not.toBe(clearIntervalOriginal);
        const fn = () => {};
        const id = setInterval(fn);
        expect(instance.intervals.timers.length).toEqual(1);
        clearInterval(id);
        expect(instance.intervals.timers.length).toEqual(0);
        instance.disable();
      });
    });

    describe('disable', () => {
      it('should be a function', () => {
        expect(instance.disable).toBeInstanceOf(Function);
      });

      it('should restore setTimeout', () => {
        instance.enable();
        expect(setTimeout).not.toBe(setTimeoutOriginal);
        instance.disable();
        expect(setTimeout).toBe(setTimeoutOriginal);
      });

      it('should restore clearTimeout', () => {
        instance.enable();
        expect(clearTimeout).not.toBe(clearTimeoutOriginal);
        instance.disable();
        expect(clearTimeout).toBe(clearTimeoutOriginal);
      });

      it('should restore setInterval', () => {
        instance.enable();
        expect(setInterval).not.toBe(setIntervalOriginal);
        instance.disable();
        expect(setInterval).toBe(setIntervalOriginal);
      });

      it('should restore clearInterval', () => {
        instance.enable();
        expect(clearInterval).not.toBe(clearIntervalOriginal);
        instance.disable();
        expect(clearInterval).toBe(clearIntervalOriginal);
      });
    });

    describe('getExpiredTimers', () => {
      it('should be a function', () => {
        expect(instance.getExpiredTimers).toBeInstanceOf(Function);
      });

      it('should return an array of expired timers from timeouts', () => {
        const mockFn = jest.fn();
        instance.timeouts.getExpired = jest.fn().mockReturnValue([{ fn: mockFn, remaining: 0 }]);
        expect(instance.getExpiredTimers()[0].fn).toBe(mockFn);
      });

      it('should order timers based on their remaining value', () => {
        const timeout1 = { fn: () => {}, remaining: -100 };
        const timeout2 = { fn: () => {}, remaining: 0 };
        const timeout3 = { fn: () => {}, remaining: -1000 };
        const timeout4 = { fn: () => {}, remaining: -200 };
        instance.timeouts.getExpired = jest.fn().mockReturnValue([timeout1, timeout2, timeout3, timeout4]);
        const interval1 = { fn: () => {}, remaining: -300 };
        const interval2 = { fn: () => {}, remaining: 0 };
        const interval3 = { fn: () => {}, remaining: -400 };
        const interval4 = { fn: () => {}, remaining: -600 };
        instance.intervals.getExpired = jest.fn().mockReturnValue([interval1, interval2, interval3, interval4]);
        const results = instance.getExpiredTimers();
        expect(results[0]).toBe(timeout3);
        expect(results[1]).toBe(interval4);
        expect(results[2]).toBe(interval3);
        expect(results[3]).toBe(interval1);
        expect(results[4]).toBe(timeout4);
        expect(results[5]).toBe(timeout1);
        expect(results[6]).toBe(timeout2);
        expect(results[7]).toBe(interval2);
      });
    });

    describe('getNextTimer', () => {
      it('should be a function', () => {
        expect(instance.getNextTimer).toBeInstanceOf(Function);
      });

      it('should return undefined if there is no next timer', () => {
        instance.intervals.getNext = jest.fn().mockReturnValue();
        instance.timeouts.getNext = jest.fn().mockReturnValue();
        expect(instance.getNextTimer()).toBeUndefined();
      });

      it('should return the next timer from timeouts if there is no interval but there is a timeout', () => {
        const mockFn = jest.fn();
        instance.intervals.getNext = jest.fn().mockReturnValue();
        instance.timeouts.getNext = jest.fn().mockReturnValue({ fn: mockFn });
        expect(instance.getNextTimer().fn).toBe(mockFn);
      });

      it('should return the next timer from intervals if there is an interval but there is no timeout', () => {
        const mockFn = jest.fn();
        instance.intervals.getNext = jest.fn().mockReturnValue({ fn: mockFn });
        instance.timeouts.getNext = jest.fn().mockReturnValue();
        expect(instance.getNextTimer().fn).toBe(mockFn);
      });

      it('should return the timer with the lowest remaining value if there is a timeout and an interval', () => {
        const mockFn1 = jest.fn();
        const mockFn2 = jest.fn();
        instance.intervals.getNext = jest.fn().mockReturnValue({ fn: mockFn1, remaining: -1 });
        instance.timeouts.getNext = jest.fn().mockReturnValue({ fn: mockFn2, remaining: 0 });
        expect(instance.getNextTimer().fn).toBe(mockFn1);
      });
    });

    describe('tick', () => {
      it('should be a function', () => {
        expect(instance.tick).toBeInstanceOf(Function);
      });

      it('should call timeouts.tick', () => {
        const tickMock = jest.fn();
        instance.timeouts.tick = tickMock;
        instance.tick();
        expect(tickMock).toHaveBeenCalledTimes(1);
      });

      it('should call intervals.tick', () => {
        const tickMock = jest.fn();
        instance.intervals.tick = tickMock;
        instance.tick();
        expect(tickMock).toHaveBeenCalledTimes(1);
      });
    });
  });
});
