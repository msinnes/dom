import { DigestibleScope } from '../../base/DigestibleScope';
import { Immediates } from '../timers/Immediates';
import { Intervals } from '../timers/Intervals';
import { Timeouts } from '../timers/Timeouts';

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
    let setImmediateOriginal;
    let clearImmediateOriginal;
    beforeEach(() => {
      instance = new TimeScope({});
      setTimeoutOriginal = setTimeout;
      clearTimeoutOriginal = clearTimeout;
      setIntervalOriginal = setInterval;
      clearIntervalOriginal = clearInterval;
      setImmediateOriginal = setImmediate;
      clearImmediateOriginal = clearImmediate;
    });

    it('should have a timeouts prop', () => {
      expect(instance.timeouts).toBeInstanceOf(Timeouts);
    });

    it('should have an intervals prop', () => {
      expect(instance.intervals).toBeInstanceOf(Intervals);
    });

    it('should have an immediates prop', () => {
      expect(instance.immediates).toBeInstanceOf(Immediates);
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

      it('should reset setImmediate to timers.set', () => {
        instance.enable();
        expect(setImmediate).not.toBe(setImmediateOriginal);
        const fn = () => {};
        setImmediate(fn);
        expect(instance.immediates.timers.length).toEqual(1);
        instance.disable();
      });

      it('should set clearImmediate to timers.clear', () => {
        instance.enable();
        expect(clearImmediate).not.toBe(clearImmediateOriginal);
        const fn = () => {};
        const id = setImmediate(fn);
        expect(instance.immediates.timers.length).toEqual(1);
        clearImmediate(id);
        expect(instance.immediates.timers.length).toEqual(0);
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

      it('should restore setImmediate', () => {
        instance.enable();
        expect(setImmediate).not.toBe(setImmediateOriginal);
        instance.disable();
        expect(setImmediate).toBe(setImmediateOriginal);
      });

      it('should restore clearImmediate', () => {
        instance.enable();
        expect(clearImmediate).not.toBe(clearImmediateOriginal);
        instance.disable();
        expect(clearImmediate).toBe(clearImmediateOriginal);
      });
    });

    describe('getExpiredTimers', () => {
      it('should be a function', () => {
        expect(instance.getExpiredTimers).toBeInstanceOf(Function);
      });

      it('should return an array of expired timers from immediates', () => {
        const mockFn = jest.fn();
        instance.immediates.getExpired = jest.fn().mockReturnValue([{ fn: mockFn, remaining: 0 }]);
        expect(instance.getExpiredTimers()[0].fn).toBe(mockFn);
      });

      it('should return an array of expired timers from timeouts', () => {
        const mockFn = jest.fn();
        instance.timeouts.getExpired = jest.fn().mockReturnValue([{ fn: mockFn, remaining: 0 }]);
        expect(instance.getExpiredTimers()[0].fn).toBe(mockFn);
      });

      it('should return an array of expired timers from intervals', () => {
        const mockFn = jest.fn();
        instance.intervals.getExpired = jest.fn().mockReturnValue([{ fn: mockFn, remaining: 0 }]);
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
        const immediate1 = { fn: () => {}, remaining: -500 };
        const immediate2 = { fn: () => {}, remaining: -25 };
        const immediate3 = { fn: () => {}, remaining: 0 };
        const immediate4 = { fn: () => {}, remaining: -900 };
        instance.immediates.getExpired = jest.fn().mockReturnValue([immediate1, immediate2, immediate3, immediate4]);
        const results = instance.getExpiredTimers();
        expect(results[0]).toBe(timeout3);
        expect(results[1]).toBe(immediate4);
        expect(results[2]).toBe(interval4);
        expect(results[3]).toBe(immediate1);
        expect(results[4]).toBe(interval3);
        expect(results[5]).toBe(interval1);
        expect(results[6]).toBe(timeout4);
        expect(results[7]).toBe(timeout1);
        expect(results[8]).toBe(immediate2);
        expect(results[9]).toBe(immediate3);
        expect(results[10]).toBe(timeout2);
        expect(results[11]).toBe(interval2);
      });
    });

    describe('getNextTimer', () => {
      it('should be a function', () => {
        expect(instance.getNextTimer).toBeInstanceOf(Function);
      });

      it('should return undefined if there is no next timer', () => {
        instance.immediates.getNext = jest.fn().mockReturnValue();
        instance.intervals.getNext = jest.fn().mockReturnValue();
        instance.timeouts.getNext = jest.fn().mockReturnValue();
        expect(instance.getNextTimer()).toBeUndefined();
      });

      it('should return the next timer from immediates if there is only a immediate', () => {
        const mockFn = jest.fn();
        instance.immediates.getNext = jest.fn().mockReturnValue({ fn: mockFn });
        instance.intervals.getNext = jest.fn().mockReturnValue();
        instance.timeouts.getNext = jest.fn().mockReturnValue();
        expect(instance.getNextTimer().fn).toBe(mockFn);
      });

      it('should return the next timer from timeouts if there is only a timeout', () => {
        const mockFn = jest.fn();
        instance.immediates.getNext = jest.fn().mockReturnValue();
        instance.intervals.getNext = jest.fn().mockReturnValue();
        instance.timeouts.getNext = jest.fn().mockReturnValue({ fn: mockFn });
        expect(instance.getNextTimer().fn).toBe(mockFn);
      });

      it('should return the next timer from intervals if there is only an interval', () => {
        const mockFn = jest.fn();
        instance.intervals.getNext = jest.fn().mockReturnValue({ fn: mockFn });
        instance.timeouts.getNext = jest.fn().mockReturnValue();
        expect(instance.getNextTimer().fn).toBe(mockFn);
      });

      it('should return the timer with the lowest remaining value', () => {
        const mockFn1 = jest.fn();
        const mockFn2 = jest.fn();
        const mockFn3 = jest.fn();
        instance.immediates.getNext = jest.fn().mockReturnValue({ fn: mockFn1, remaining: -1, isBefore: timer => -1 < timer.remaining });
        instance.intervals.getNext = jest.fn().mockReturnValue({ fn: mockFn2, remaining: -2, isBefore: timer => -2 < timer.remaining });
        instance.timeouts.getNext = jest.fn().mockReturnValue({ fn: mockFn3, remaining: 0, isBefore: timer => 0 < timer.remaining });
        expect(instance.getNextTimer().fn).toBe(mockFn2);
      });
    });

    describe('tick', () => {
      it('should be a function', () => {
        expect(instance.tick).toBeInstanceOf(Function);
      });

      it('should call immediates.tick', () => {
        const tickMock = jest.fn();
        instance.immediates.tick = tickMock;
        instance.tick();
        expect(tickMock).toHaveBeenCalledTimes(1);
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
