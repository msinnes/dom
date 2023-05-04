import { Timer } from '../Timer';

describe('Timer', () => {
  it('should be a class', () => {
    expect(Timer).toBeAClass();
  });

  describe('instance', () => {
    let instance;

    let mockFn;

    beforeEach(() => {
      mockFn = jest.fn();
      instance = new Timer(mockFn);
    });

    it('should set the fn prop', () => {
      expect(instance.fn).toBe(mockFn);
    });

    it('should set a wait prop if one is passed', () => {
      expect(instance.wait).toEqual(0);
      instance = new Timer(mockFn, 100);
      expect(instance.wait).toEqual(100);
    });

    it('should have a elapsed prop', () => {
      expect(instance.elapsed).toEqual(0);
    });

    it('should have an args prop', () => {
      expect(instance.args).toBeInstanceOf(Array);
      expect(instance.args.length).toEqual(0);
      instance = new Timer(() => {}, 0, ['arg1', 'arg2']);
      expect(instance.args).toMatchObject(['arg1', 'arg2']);
    });

    it('should have a remaining getter', () => {
      expect(instance.remaining).toEqual(0);
      instance.elapsed = 100;
      expect(instance.remaining).toEqual(-100);
      instance.wait = 200;
      expect(instance.remaining).toEqual(100);
    });

    it('should have an expired getter', () => {
      instance.elapsed = 100;
      expect(instance.expired).toEqual(true);
      instance.wait = 200;
      expect(instance.expired).toEqual(false);
    });

    describe('exec', () => {
      it('should be a function', () => {
        expect(instance.exec).toBeInstanceOf(Function);
      });

      it('should execute the fn prop', () => {
        expect(mockFn).toHaveBeenCalledTimes(0);
        instance.exec();
        expect(mockFn).toHaveBeenCalledTimes(1);
        expect(mockFn).toHaveBeenCalledWith();
      });

      it('should call the mock with args', () => {
        instance = new Timer(mockFn, 0, ['arg1', 'arg2']);
        instance.exec();
        expect(mockFn).toHaveBeenCalledTimes(1);
        expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
      });
    });

    describe('isBefore', () => {
      it('should be a function', () => {
        expect(instance.isBefore).toBeInstanceOf(Function);
      });

      it('should return true if the input timer remaining is bigger than the testing timer remaining', () => {
        expect(instance.isBefore({ remaining: -1 })).toBe(false);
        expect(instance.isBefore({ remaining: 1 })).toBe(true);
      });
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
