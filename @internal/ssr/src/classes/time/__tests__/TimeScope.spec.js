import { DigestibleScope } from '../../base/DigestibleScope';
import { AnimationFrames } from '../timers/AnimationFrames';
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

    it('should have an animationFrames prop', () => {
      expect(instance.animationFrames).toBeInstanceOf(AnimationFrames);
    });

    it('should have a digestExpiredTimers prop defaulted to true', () => {
      expect(instance.digestExpiredTimers).toBe(true);
    });

    it('should set digestExpiredTimers if a value is passed', () => {
      instance = new TimeScope({ digestExpiredTimers: true });
      expect(instance.digestExpiredTimers).toBe(true);
      instance = new TimeScope({ digestExpiredTimers: false });
      expect(instance.digestExpiredTimers).toBe(false);
    });

    describe('digest', () => {
      it('should be a function', () => {
        expect(instance.digest).toBeInstanceOf(Function);
      });

      it('should make a call to instance.getAll if digestExpiredTimers is true', () => {
        const fn = () => {};
        const getAllMock = jest.fn().mockReturnValue([fn]);
        instance.getAll = getAllMock;
        let results = instance.digest();
        expect(getAllMock).toHaveBeenCalledTimes(1);
        expect(results.length).toEqual(1);
        expect(results[0]).toBe(fn);
        instance = new TimeScope({ digestExpiredTimers: false });
        instance.run = getAllMock;
        results = instance.digest();
        expect(getAllMock).toHaveBeenCalledTimes(1);
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

      it('should reset requestAnimationFrame to timers.set', () => {
        instance.enable();
        expect(requestAnimationFrame).toBeDefined();
        const fn = () => {};
        requestAnimationFrame(fn);
        expect(instance.animationFrames.timers.length).toEqual(1);
        instance.disable();
      });

      it('should set cancelAnimationFrame to timers.clear', () => {
        instance.enable();
        expect(requestAnimationFrame).toBeDefined();
        const fn = () => {};
        const id = requestAnimationFrame(fn);
        expect(instance.animationFrames.timers.length).toEqual(1);
        cancelAnimationFrame(id);
        expect(instance.animationFrames.timers.length).toEqual(0);
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

      it('should delete requestAnimationFrame', () => {
        instance.enable();
        expect(requestAnimationFrame).toBeDefined();
        instance.disable();
        expect(global.requestAnimationFrame).toBeUndefined();
      });

      it('should delete cancelAnimationFrame', () => {
        instance.enable();
        expect(cancelAnimationFrame).toBeDefined();
        instance.disable();
        expect(global.cancelAnimationFrame).toBeUndefined();
      });
    });

    describe('getAll', () => {
      it('should be a function', () => {
        expect(instance.getAll).toBeInstanceOf(Function);
      });

      it('should return an array of expired timers from timeouts', () => {
        const mockFn = jest.fn();
        instance.timeouts.getExpired = jest.fn().mockReturnValue([{ fn: mockFn, remaining: 0 }]);
        expect(instance.getAll()[0].fn).toBe(mockFn);
      });

      it('should return an array of expired timers from intervals', () => {
        const mockFn = jest.fn();
        instance.intervals.getExpired = jest.fn().mockReturnValue([{ fn: mockFn, remaining: 0 }]);
        expect(instance.getAll()[0].fn).toBe(mockFn);
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
        const animationFrame1 = { fn: () => {}, remaining: -500 };
        const animationFrame2 = { fn: () => {}, remaining: 0 };
        const animationFrame3 = { fn: () => {}, remaining: -700 };
        const animationFrame4 = { fn: () => {}, remaining: -900 };
        instance.animationFrames.getExpired = jest.fn().mockReturnValue([animationFrame1, animationFrame2, animationFrame3, animationFrame4]);
        const results = instance.getAll();
        expect(results[0]).toBe(timeout3);
        expect(results[1]).toBe(animationFrame4);
        expect(results[2]).toBe(animationFrame3);
        expect(results[3]).toBe(interval4);
        expect(results[4]).toBe(animationFrame1);
        expect(results[5]).toBe(interval3);
        expect(results[6]).toBe(interval1);
        expect(results[7]).toBe(timeout4);
        expect(results[8]).toBe(timeout1);
        expect(results[9]).toBe(timeout2);
        expect(results[10]).toBe(interval2);
        expect(results[11]).toBe(animationFrame2);
      });
    });

    describe('getNext', () => {
      it('should be a function', () => {
        expect(instance.getNext).toBeInstanceOf(Function);
      });

      it('should return undefined if there is no next timer', () => {
        instance.animationFrames.next = jest.fn().mockReturnValue();
        instance.intervals.next = jest.fn().mockReturnValue();
        instance.timeouts.next = jest.fn().mockReturnValue();
        expect(instance.getNext()).toBeUndefined();
      });

      it('should return the next timer from timeouts if there is only a timeout', () => {
        const mockFn = jest.fn();
        instance.animationFrames.next = jest.fn().mockReturnValue();
        instance.intervals.next = jest.fn().mockReturnValue();
        instance.timeouts.next = jest.fn().mockReturnValue({ fn: mockFn });
        expect(instance.getNext().fn).toBe(mockFn);
      });

      it('should return the next timer from intervals if there is only an interval', () => {
        const mockFn = jest.fn();
        instance.animationFrames.next = jest.fn().mockReturnValue();
        instance.intervals.next = jest.fn().mockReturnValue({ fn: mockFn });
        instance.timeouts.next = jest.fn().mockReturnValue();
        expect(instance.getNext().fn).toBe(mockFn);
      });

      it('should return the next timer from animationFrames if there is only an animationFrame', () => {
        const mockFn = jest.fn();
        instance.animationFrames.next = jest.fn().mockReturnValue({ fn: mockFn });
        instance.intervals.next = jest.fn().mockReturnValue();
        instance.timeouts.next = jest.fn().mockReturnValue();
        expect(instance.getNext().fn).toBe(mockFn);
      });

      it('should return the timer with the lowest remaining value', () => {
        const mockFn1 = jest.fn();
        const mockFn2 = jest.fn();
        const mockFn3 = jest.fn();
        instance.animationFrames.next = jest.fn().mockReturnValue({ fn: mockFn1, remaining: -1, isBefore: timer => -1 < timer.remaining });
        instance.intervals.next = jest.fn().mockReturnValue({ fn: mockFn2, remaining: -2, isBefore: timer => -2 < timer.remaining });
        instance.timeouts.next = jest.fn().mockReturnValue({ fn: mockFn3, remaining: 0, isBefore: timer => 0 < timer.remaining });
        expect(instance.getNext().fn).toBe(mockFn2);
      });

      describe('e2e', () => {
        it('should not clear the a timer if it is not executed', () => {
          const mockFn1 = jest.fn();
          const mockFn2 = jest.fn();
          const mockFn3 = jest.fn();
          instance.timeouts.set(mockFn1);
          instance.intervals.set(mockFn2);
          instance.animationFrames.set(mockFn3);

          for(let i = 0; i < 16; i++) {
            instance.tick();
          }

          const next = instance.getNext();
          expect(next.fn).toBe(mockFn1);
          expect(instance.intervals.timers.length).toEqual(1);
          expect(instance.animationFrames.timers.length).toEqual(1);
        });
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

      it('should call animationFrames.tick', () => {
        const tickMock = jest.fn();
        instance.animationFrames.tick = tickMock;
        instance.tick();
        expect(tickMock).toHaveBeenCalledTimes(1);
      });
    });
  });
});
