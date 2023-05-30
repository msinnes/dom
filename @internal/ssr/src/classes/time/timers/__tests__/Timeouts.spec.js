import { Timer } from '../../base/Timer';
import { Timers } from '../../base/Timers';

import { Timeout, Timeouts } from '../Timeouts';

describe('Timeout', () => {
  it('should be a class', () => {
    expect(Timeout).toBeAClass();
  });

  it('should extend Timers', () => {
    expect(Timeout).toExtend(Timer);
  });
});

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

    describe('create', () => {
      it('shold return an Interval instance', () => {
        const fn = () => {};
        const timer = instance.create(fn, 1, 'arg1');
        expect(timer).toBeInstanceOf(Timeout);
        expect(timer.fn).toBe(fn);
        expect(timer.wait).toEqual(1);
        expect(timer.args).toBeInstanceOf(Array);
        expect(timer.args[0]).toEqual('arg1');
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
        expired[0].fn();
        expect(mockFn2).toHaveBeenCalledTimes(1);
        expect(instance.timers.length).toEqual(1);
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
        next.fn();
        expect(mockFn2).toHaveBeenCalledTimes(1);
        expect(instance.timers.length).toEqual(1);
      });

      it('should return undefined if there are no timeouts', () => {
        instance = new Timeouts();
        expect(instance.getNext()).toBeUndefined();
      });

      it('should return undefined if there are all expired timeouts are exhausted', () => {
        let next = instance.getNext();
        next.fn();
        expect(mockFn2).toHaveBeenCalledTimes(1);
        expect(instance.timers.length).toEqual(1);
        next = instance.getNext();
        expect(next).toBeUndefined();
        expect(instance.timers.length).toEqual(1);
        instance.timers[0].fn();
        expect(mockFn1).toHaveBeenCalledTimes(1);
      });
    });
  });
});
