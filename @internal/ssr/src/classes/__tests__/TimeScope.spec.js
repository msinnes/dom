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
      expect(instance.remaining).toEqual(0);
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

    describe('process', () => {
      let mockFn;
      beforeEach(() => {
        mockFn = jest.fn();
        tickMock = jest.fn();
        instance.set(mockFn);
        instance.set(mockFn);
        instance.set(mockFn, 1);
      });

      it('should be a function', () => {
        expect(instance.process).toBeInstanceOf(Function);
      });

      it('should process any timeouts with a remaining value of 0', () => {
        instance.process();
        expect(mockFn).toHaveBeenCalledTimes(2);
      });

      it('should clear any executed timeouts', () => {
        instance.process();
        expect(instance.timeouts.length).toEqual(1);
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
      instance = new TimeScope();
      setTimeoutOriginal = setTimeout;
      clearTimeoutOriginal = clearTimeout;
    });

    it('should have a timeouts prop', () => {
      expect(instance.timeouts).toBeInstanceOf(Timeouts);
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

    describe('play', () => {
      let processMock;
      let tickMock;
      beforeEach(() => {
        processMock = jest.fn();
        tickMock = jest.fn();
        instance.timeouts.process = processMock;
        instance.timeouts.tick = tickMock;
      });

      it('should be a function', () => {
        expect(instance.play).toBeInstanceOf(Function);
      });

      it('should call tick and process once', () => {
        instance.play();
        expect(tickMock).toHaveBeenCalledTimes(1);
        expect(processMock).toHaveBeenCalledTimes(1);
      });
    });

    describe('run', () => {
      it('should be a function', () => {
        expect(instance.run).toBeInstanceOf(Function);
      });

      it('should call timeouts.process', () => {
        const processMock = jest.fn();
        instance.timeouts.process = processMock;
        instance.run();
        expect(processMock).toHaveBeenCalledTimes(1);
      });
    });
  });
});
