import { Timer } from '../../base/Timer';
import { Timeouts } from '../Timeouts';

import { AnimationFrame, AnimationFrames } from '../AnimationFrames';

describe('AnimationFrame', () => {
  it('should be a class', () => {
    expect(AnimationFrame).toBeAClass();
  });

  it('should extend Timer', () => {
    expect(AnimationFrame).toExtend(Timer);
  });

  describe('instance', () => {
    let instance;

    let mockFn;
    beforeEach(() => {
      mockFn = jest.fn();
      instance = new AnimationFrame(mockFn, 100);
    });

    it('should have a createdAt prop', () => {
      expect(instance.createdAt).toEqual(100);
    });

    it('should set wait to 16', () => {
      expect(instance.wait).toEqual(16);
    });

    it('should not have any arguments', () => {
      expect(instance.args.length).toEqual(0);
      instance = new AnimationFrame(mockFn, 'arg1', 'arg2');
      expect(instance.args.length).toEqual(0);
    });

    describe('exec', () => {
      it('should call fn with createdAt + wait', () => {
        instance.exec();
        expect(mockFn).toHaveBeenCalledTimes(1);
        expect(mockFn).toHaveBeenCalledWith(116);
      });
    });
  });
});

describe('AnimationFrames', () => {
  it('should be a class', () => {
    expect(AnimationFrames).toBeAClass();
  });

  it('should extends Timeouts', () => {
    expect(AnimationFrames).toExtend(Timeouts);
  });

  describe('instance', () => {
    let instance;

    let mockFn;
    beforeEach(() => {
      instance = new AnimationFrames();
      mockFn = jest.fn();
    });

    it('should have a ticks prop', () => {
      expect(instance.ticks).toEqual(0);
    });

    describe('create', () => {
      it('should create an AnimationFrame', () => {
        let frame = instance.create(mockFn);
        expect(frame).toBeInstanceOf(AnimationFrame);
        expect(frame.createdAt).toEqual(0);
        expect(frame.fn).toEqual(mockFn);
        instance.tick();
        frame = instance.create(mockFn);
        expect(frame.createdAt).toEqual(1);
      });
    });

    describe('tick', () => {
      it('should increment the ticks prop and then call super.tick', () => {
        instance.set(mockFn);
        const tickSpy = jest.spyOn(instance.timers[0], 'tick');
        instance.tick();
        expect(instance.ticks).toEqual(1);
        expect(tickSpy).toHaveBeenCalledTimes(1);
      });
    });
  });
});
