import { Timer } from '../Timer';

describe('Timer', () => {
  it('should be a class', () => {
    expect(Timer).toBeAClass();
  });

  describe('instance', () => {
    let mockFn;
    let instance;
    beforeEach(() => {
      mockFn = jest.fn();
      instance = new Timer(mockFn);
    });

    it('should set an elapsed value to 0', () => {
      expect(instance.elapsed).toEqual(0);
    });

    it('should set the fn prop', () => {
      expect(instance.fn).toBeInstanceOf(Function);
      instance.fn();
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should set a wait prop if one is passed', () => {
      expect(instance.wait).toEqual(0);
      instance = new Timer(mockFn, 100);
      expect(instance.wait).toEqual(100);
    });

    it('should have a remaining getter', () => {
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

      it('should increment the elapsed time on each Timer', () => {
        instance.tick();
        expect(instance.elapsed).toEqual(1);
      });
    });
  });
});
