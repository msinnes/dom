import { Timers } from '../Timers';

class TestableTimers extends Timers {
  getExpired() {}
  getNext() {}
}

describe('Timers', () => {
  it('should be a class', () => {
    expect(Timers).toBeAClass();
  });

  it('should be abstract', () => {
    expect(Timers).toBeAbstract();
  });

  it('should have an abstract method getExpired', () => {
    class NoGetExpiredTimers extends Timers {
      getNext() {}
    }
    expect(NoGetExpiredTimers).toHaveAbstractMethod('getExpired');
  });

  it('should have an abstract method getNext', () => {
    class NoGetNextTimers extends Timers {
      getExpired() {}
    }
    expect(NoGetNextTimers).toHaveAbstractMethod('getNext');
  });

  describe('instance', () => {
    let instance;
    beforeEach(() => {
      instance = new TestableTimers();
    });

    it('should have a starting id', () => {
      expect(instance.nextId).toEqual(1);
    });

    it('should have an array of ids', () => {
      expect(instance.ids).toBeInstanceOf(Array);
      expect(instance.ids.length).toEqual(0);
    });

    it('should have an array of timers', () => {
      expect(instance.timers).toBeInstanceOf(Array);
      expect(instance.timers.length).toEqual(0);
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
        expect(instance.timers.length).toEqual(2);
      });

      it('should not perform any action if the id is not found', () => {
        instance.clear(0);
        expect(instance.ids.length).toEqual(3);
        expect(instance.timers.length).toEqual(3);
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
        expect(mockCallback.mock.calls[0][0]).toBe(instance.timers[0]);
        expect(mockCallback.mock.calls[0][1]).toBe(id1);
        expect(mockCallback.mock.calls[1][0]).toBe(instance.timers[1]);
        expect(mockCallback.mock.calls[1][1]).toBe(id2);
        expect(mockCallback.mock.calls[2][0]).toBe(instance.timers[2]);
        expect(mockCallback.mock.calls[2][1]).toBe(id3);
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
        expect(instance.timers.length).toEqual(1);
        expect(instance.timers[0].fn).toBeInstanceOf(Function);
        expect(instance.timers[0].wait).toEqual(100);
        instance.timers[0].fn();
        expect(fn).toHaveBeenCalledTimes(1);
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
        instance.timers.forEach(timer => timer.tick = tickMock);
        instance.process = processMock;
      });

      it('should be a function', () => {
        expect(instance.tick).toBeInstanceOf(Function);
      });

      it('should call tick on every timer', () => {
        instance.tick();
        expect(tickMock).toHaveBeenCalledTimes(3);
      });
    });
  });
});
