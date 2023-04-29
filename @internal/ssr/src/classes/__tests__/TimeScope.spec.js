import { Timeout, Timeouts, TimeScope } from '../TimeScope';

describe('Timeout', () => {
  it('should be a class', () => {
    expect(Timeout).toBeAClass();
  });

  describe('instance', () => {
    let mockFn;
    let instance;
    beforeEach(() => {
      mockFn = jest.fn();
      instance = new Timeout(mockFn);
    });

    it('should set an elapsed value to 0', () => {
      expect(instance.elapsed).toEqual(0);
    });

    it('should set the fn prop', () => {
      expect(instance.fn).toBe(mockFn);
    });

    it('should set a wait prop if one is passed', () => {
      expect(instance.wait).toEqual(0);
      instance = new Timeout(mockFn, 100);
      expect(instance.wait).toEqual(100);
    });

    it('should have a remaining getter which is floored to 0', () => {
      expect(instance.remaining).toEqual(0);
      instance.elapsed = 100;
      expect(instance.remaining).toEqual(-100);
      instance.wait = 200;
      expect(instance.remaining).toEqual(100);
    });

    describe('tick', () => {
      it('should be a function', () => {
        expect(instance.tick).toBeInstanceOf(Function);
      });

      it('should increment the elapsed time on each timeout', () => {
        instance.tick();
        expect(instance.elapsed).toEqual(1);
      });
    });
  });
});

describe('Timeouts', () => {
  it('it should be a class', () => {
    expect(Timeouts).toBeAClass();
  });

  describe('instance', () => {
    let instance;
    beforeEach(() => {
      instance = new Timeouts();
    });

    it('should have a starting id', () => {
      expect(instance.currentId).toEqual(1);
    });

    it('should have an array of ids', () => {
      expect(instance.ids).toBeInstanceOf(Array);
      expect(instance.ids.length).toEqual(0);
    });

    it('should have an array of timeouts', () => {
      expect(instance.timeouts).toBeInstanceOf(Array);
      expect(instance.timeouts.length).toEqual(0);
    });

    describe('clear', () => {
      let id1;
      let id2;
      let id3;
      beforeEach(() => {
        id1 = instance.set(() => {});
        id2 = instance.set(() => {});
        id3 = instance.set(() => {});
      });

      it('should be a function', () => {
        expect(instance.clear).toBeInstanceOf(Function);
      });

      it('should clear a timeout based on its id', () => {
        instance.clear(id2);
        expect(instance.ids.length).toEqual(2);
        expect(instance.ids[0]).toEqual(id1);
        expect(instance.ids[1]).toEqual(id3);
        expect(instance.timeouts.length).toEqual(2);
      });

      it('should not perform any action if the id is not found', () => {
        instance.clear(0);
        expect(instance.ids.length).toEqual(3);
        expect(instance.timeouts.length).toEqual(3);
      });
    });

    describe('each', () => {
      it('should be a function', () => {
        expect(instance.each).toBeInstanceOf(Function);
      });

      it('should run a callback with timeout and id for each timeout in the stack', () => {
        const fn = () => {};
        const id1 = instance.set(fn);
        const id2 = instance.set(fn);
        const id3 = instance.set(fn);
        const mockCallback = jest.fn();
        instance.each(mockCallback);
        expect(mockCallback).toHaveBeenCalledTimes(3);
        expect(mockCallback.mock.calls[0][0]).toBe(instance.timeouts[0]);
        expect(mockCallback.mock.calls[0][1]).toBe(id1);
        expect(mockCallback.mock.calls[1][0]).toBe(instance.timeouts[1]);
        expect(mockCallback.mock.calls[1][1]).toBe(id2);
        expect(mockCallback.mock.calls[2][0]).toBe(instance.timeouts[2]);
        expect(mockCallback.mock.calls[2][1]).toBe(id3);
      });
    });

    describe('getExpired', () => {
      let mockFn1;
      let mockFn2;
      beforeEach(() => {
        mockFn1 = jest.fn();
        mockFn2 = jest.fn();
        instance.set(mockFn1, 1);
        instance.set(mockFn2);
      });

      it('should be a function', () => {
        expect(instance.getExpired).toBeInstanceOf(Function);
      });

      it('should return an array with all expired timers', () => {
        const expired = instance.getExpired();
        expect(expired.length).toEqual(1);
        expect(expired[0].fn).toBe(mockFn2);
        expect(instance.timeouts.length).toEqual(1);
        expect(instance.timeouts[0].fn).toBe(mockFn1);
      });
    });

    describe('getNext', () => {
      let mockFn1;
      let mockFn2;
      beforeEach(() => {
        mockFn1 = jest.fn();
        mockFn2 = jest.fn();
        instance.set(mockFn1, 1);
        instance.set(mockFn2);
      });

      it('should be a function', () => {
        expect(instance.getNext).toBeInstanceOf(Function);
      });

      it('should return an array with all expired timers', () => {
        const next = instance.getNext();
        expect(next.fn).toBe(mockFn2);
        expect(instance.timeouts.length).toEqual(1);
        expect(instance.timeouts[0].fn).toBe(mockFn1);
      });

      it('should return undefined if there are no timeouts', () => {
        instance = new Timeouts();
        expect(instance.getNext()).toBeUndefined();
      });

      it('should return undefined if there are all expired timeouts are exhausted', () => {
        let next = instance.getNext();
        expect(next.fn).toBe(mockFn2);
        expect(instance.timeouts.length).toEqual(1);
        expect(instance.timeouts[0].fn).toBe(mockFn1);
        next = instance.getNext();
        expect(next).toBeUndefined();
        expect(instance.timeouts.length).toEqual(1);
        expect(instance.timeouts[0].fn).toBe(mockFn1);
      });
    });

    describe('set', () => {
      it('should be a function', () => {
        expect(instance.set).toBeInstanceOf(Function);
      });

      it('should add an id to the list of ids, increment the id tick, and return the id', () => {
        const id = instance.set(jest.fn());
        expect(instance.ids.length).toEqual(1);
        expect(instance.ids[0]).toEqual(id);
        expect(id).toEqual(1);
      });

      it('should add a timeout to the list of timeouts', () => {
        const fn = jest.fn();
        instance.set(fn, 100);
        expect(instance.timeouts.length).toEqual(1);
        expect(instance.timeouts[0].fn).toBe(fn);
        expect(instance.timeouts[0].wait).toEqual(100);
      });
    });

    describe('tick', () => {
      let mockFn;
      let processMock;
      let tickMock;
      beforeEach(() => {
        mockFn = jest.fn();
        processMock = jest.fn();
        tickMock = jest.fn();
        instance.set(mockFn, 1);
        instance.set(mockFn, 2);
        instance.set(mockFn, 3);
        instance.timeouts.forEach(timeout => timeout.tick = tickMock);
        instance.process = processMock;
      });

      it('should be a function', () => {
        expect(instance.tick).toBeInstanceOf(Function);
      });

      it('should call tick on every timeout', () => {
        instance.tick();
        expect(tickMock).toHaveBeenCalledTimes(3);
      });
    });
  });
});

describe('TimeScope', () => {
  it('should be a class', () => {
    expect(TimeScope).toBeAClass();
  });

  describe('instance', () => {
    let instance;
    let setTimeoutOriginal;
    let clearTimeoutOriginal;
    beforeEach(() => {
      instance = new TimeScope({});
      setTimeoutOriginal = setTimeout;
      clearTimeoutOriginal = clearTimeout;
    });

    it('should have a timeouts prop', () => {
      expect(instance.timeouts).toBeInstanceOf(Timeouts);
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

      it('should make a call to instance.run if runExpiredTimers is true', () => {
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

      it('should reset setTimeout to timeouts.set', () => {
        instance.enable();
        expect(setTimeout).not.toBe(setTimeoutOriginal);
        const fn = () => {};
        setTimeout(fn);
        expect(instance.timeouts.timeouts.length).toEqual(1);
        instance.disable();
      });

      it('should set clearTimeout to timeouts.clear', () => {
        instance.enable();
        expect(clearTimeout).not.toBe(clearTimeoutOriginal);
        const fn = () => {};
        const id = setTimeout(fn);
        expect(instance.timeouts.timeouts.length).toEqual(1);
        clearTimeout(id);
        expect(instance.timeouts.timeouts.length).toEqual(0);
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
        const timer1 = { fn: () => {}, remaining: -100 };
        const timer2 = { fn: () => {}, remaining: 0 };
        const timer3 = { fn: () => {}, remaining: -1000 };
        const timer4 = { fn: () => {}, remaining: -200 };
        instance.timeouts.getExpired = jest.fn().mockReturnValue([timer1, timer2, timer3, timer4]);
        const results = instance.getExpiredTimers();
        expect(results[0]).toBe(timer3);
        expect(results[1]).toBe(timer4);
        expect(results[2]).toBe(timer1);
        expect(results[3]).toBe(timer2);
      });
    });

    describe('getNextTimer', () => {
      it('should be a function', () => {
        expect(instance.getNextTimer).toBeInstanceOf(Function);
      });

      it('should return the next timer from timeouts', () => {
        const mockFn = jest.fn();
        instance.timeouts.getNext = jest.fn().mockReturnValue({ fn: mockFn });
        expect(instance.getNextTimer().fn).toBe(mockFn);
      });
    });

    describe('tick', () => {
      it('should be a function', () => {
        expect(instance.tick).toBeInstanceOf(Function);
      });

      it('should call timeouts.process', () => {
        const tickMock = jest.fn();
        instance.timeouts.tick = tickMock;
        instance.tick();
        expect(tickMock).toHaveBeenCalledTimes(1);
      });
    });
  });
});
