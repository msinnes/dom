import { Timers } from '../Timers';

import { Timeouts } from '../Timeouts';

describe('Timeouts', () => {
  it('should be a class', () => {
    expect(Timeouts).toBeAClass();
  });

  it('should extend Timers', () => {
    expect(Timeouts).toExtend(Timers);
  });

  describe('instance', () => {
    let instance;
    beforeEach(() => {
      instance = new Timeouts();
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
        expect(instance.timers.length).toEqual(1);
        expect(instance.timers[0].fn).toBe(mockFn1);
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

      it('should the next expired timer', () => {
        const next = instance.getNext();
        expect(next.fn).toBe(mockFn2);
        expect(instance.timers.length).toEqual(1);
        expect(instance.timers[0].fn).toBe(mockFn1);
      });

      it('should return undefined if there are no timeouts', () => {
        instance = new Timeouts();
        expect(instance.getNext()).toBeUndefined();
      });

      it('should return undefined if there are all expired timeouts are exhausted', () => {
        let next = instance.getNext();
        expect(next.fn).toBe(mockFn2);
        expect(instance.timers.length).toEqual(1);
        expect(instance.timers[0].fn).toBe(mockFn1);
        next = instance.getNext();
        expect(next).toBeUndefined();
        expect(instance.timers.length).toEqual(1);
        expect(instance.timers[0].fn).toBe(mockFn1);
      });
    });
  });
});
