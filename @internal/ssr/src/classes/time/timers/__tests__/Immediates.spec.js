import { Timer } from '../../base/Timer';

import { Timeouts } from '../Timeouts';

import { Immediate, Immediates } from '../Immediates';

describe('Immediate', () => {
  it('should be a class', () => {
    expect(Immediate).toBeAClass();
  });

  it('should extend Timer', () => {
    expect(Immediate).toExtend(Timer);
  });

  describe('instance', () => {
    let instance;

    let mockFn;

    beforeEach(() => {
      mockFn = jest.fn();
      instance = new Immediate(mockFn);
    });

    it('should create a timer with wait locked to 0', () => {
      expect(instance.wait).toEqual(0);
      instance = new Immediate(mockFn, 1000);
      expect(instance.wait).toEqual(0);
    });
  });
});

describe('Immediates', () => {
  it('should be a class', () => {
    expect(Immediates).toBeAClass();
  });

  it('should extend Timeouts', () => {
    expect(Immediates).toExtend(Timeouts);
  });

  describe('instance', () => {
    let instance;

    let mockFn;
    beforeEach(() => {
      instance = new Immediates();
      mockFn = jest.fn();
    });

    describe('create', () => {
      it('should create an immediate', () => {
        let immediate = instance.create(mockFn);
        expect(immediate.wait).toEqual(0);
        expect(immediate.fn).toBe(mockFn);
        immediate = instance.create(mockFn, 1000);
        expect(immediate.wait).toEqual(0);
        expect(immediate.fn).toBe(mockFn);
      });
    });
  });
});
