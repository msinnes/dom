import { Timers } from '../Timers';

import { Intervals } from '../Intervals';

describe('Intervals', () => {
  it('should be a class', () => {
    expect(Intervals).toBeAClass();
  });

  it('should extend Timers', () => {
    expect(Intervals).toExtend(Timers);
  });

  describe('instance', () => {
    let instance;
    beforeEach(() => {
      instance = new Intervals();
    });

    describe('getExpired', () => {
      let mockFn1;
      let mockFn2;
      beforeEach(() => {
        mockFn1 = jest.fn();
        mockFn2 = jest.fn();
        instance.set(mockFn1, 1);
        instance.set(mockFn2, 2);
      });

      it('should be a function', () => {
        expect(instance.getExpired).toBeInstanceOf(Function);
      });

      it('should return an array with all expired timers', () => {
        let results = instance.getExpired();
        expect(results).toBeInstanceOf(Array);
        expect(results.length).toEqual(0);
        instance.tick();
        results = instance.getExpired();
        expect(results.length).toEqual(1);
        results[0].fn();
        expect(mockFn1).toHaveBeenCalledTimes(1);
        instance.tick();
        results = instance.getExpired();
        expect(results.length).toEqual(2);
        results[0].fn();
        expect(mockFn1).toHaveBeenCalledTimes(2);
        results[1].fn();
        expect(mockFn2).toHaveBeenCalledTimes(1);
        instance.tick();
        results = instance.getExpired();
        expect(results.length).toEqual(1);
        results[0].fn();
        expect(mockFn1).toHaveBeenCalledTimes(3);
        instance.tick();
        results = instance.getExpired();
        expect(results.length).toEqual(2);
        results[0].fn();
        expect(mockFn1).toHaveBeenCalledTimes(4);
        results[1].fn();
        expect(mockFn2).toHaveBeenCalledTimes(2);
      });

      it('should not return an interval if it has run this tick', () => {
        instance.timers[0].ranThisTick = true;
        const results = instance.getExpired();
        expect(results.length).toEqual(0);
      });
    });

    describe('getNext', () => {
      let mockFn1;
      let mockFn2;
      beforeEach(() => {
        mockFn1 = jest.fn();
        mockFn2 = jest.fn();
        instance.set(mockFn1, 1);
        instance.set(mockFn2, 2);
      });

      it('should be a function', () => {
        expect(instance.getNext).toBeInstanceOf(Function);
      });

      it('should the next expired timer', () => {
        let next = instance.getNext();
        expect(next).toBeUndefined();
        instance.tick();
        next = instance.getNext();
        next.fn();
        expect(mockFn1).toHaveBeenCalledTimes(1);
        instance.tick();
        next = instance.getNext();
        next.fn();
        expect(mockFn1).toHaveBeenCalledTimes(2);
        next = instance.getNext();
        next.fn();
        expect(mockFn2).toHaveBeenCalledTimes(1);
        instance.tick();
        next = instance.getNext();
        next.fn();
        expect(mockFn1).toHaveBeenCalledTimes(3);
        next = instance.getNext();
        expect(next).toBeUndefined();
      });

      it('should not get the next timer if it has already run this tick', () => {
        instance.timers[0].ranThisTick = true;
        instance.timers[0].wait = 0;
        const next = instance.getNext();
        expect(next).toBeUndefined();
      });

      it('should not replace the next timer if the timer with lower remaining value has already ran this tick', () => {
        instance.timers[0].wait = 0;
        instance.timers[1].wait = -1;
        instance.timers[1].ranThisTick = true;
        const next = instance.getNext();
        next.fn();
        expect(mockFn1).toHaveBeenCalledTimes(1);
      });
    });
  });
});
