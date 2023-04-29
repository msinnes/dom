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
        expect(results[0].fn).toBe(mockFn1);
        instance.tick();
        results = instance.getExpired();
        expect(results.length).toEqual(2);
        expect(results[0].fn).toBe(mockFn1);
        expect(results[1].fn).toBe(mockFn2);
        instance.tick();
        results = instance.getExpired();
        expect(results.length).toEqual(1);
        expect(results[0].fn).toBe(mockFn1);
        instance.tick();
        results = instance.getExpired();
        expect(results.length).toEqual(2);
        expect(results[0].fn).toBe(mockFn1);
        expect(results[1].fn).toBe(mockFn2);
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
        expect(next.fn).toBe(mockFn1);
        instance.tick();
        next = instance.getNext();
        expect(next.fn).toBe(mockFn1);
        next = instance.getNext();
        expect(next.fn).toBe(mockFn2);
        instance.tick();
        next = instance.getNext();
        expect(next.fn).toBe(mockFn1);
        next = instance.getNext();
        expect(next).toBeUndefined();
      });
    });
  });
});
