import { BaseDependable } from '../BaseDependable';

class TestDependable extends BaseDependable {}

describe('BaseDependable', () => {
  it('should be a class', () => {
    expect(BaseDependable).toBeAClass();
  });

  it('should be abstract', () => {
    expect(BaseDependable).toBeAbstract();
  });

  describe('instance', () => {
    let fn;
    let instance;
    let dependencies;
    beforeEach(() => {
      fn = jest.fn();
      dependencies = ['value'];
      instance = new TestDependable(fn, dependencies);
    });

    it('should set the fn prop', () => {
      expect(instance.fn).toBe(fn);
    });

    it('should have a tick prop set to 0', () => {
      expect(instance.tick).toEqual(0);
    });

    it('should set the dependencies prop', () => {
      expect(instance.dependencies).toBe(dependencies);
    });

    describe('shouldExecute', () => {
      it('should be a function', () => {
        expect(instance.shouldExecute).toBeInstanceOf(Function);
      });

      it('should return true if tick is 0', () => {
        expect(instance.shouldExecute(['value'])).toEqual(true);
      });

      it('should increment instance.tick', () => {
        expect(instance.shouldExecute(['value'])).toEqual(true);
        expect(instance.tick).toEqual(1);
      });

      it('should update the dependency array', () => {
        const next = ['value'];
        expect(instance.shouldExecute(next)).toEqual(true);
        expect(instance.dependencies).toBe(next);
      });

      it('should return false if tick is greater than 0 and dependencies is empty', () => {
        instance.tick++;
        instance.dependencies = [];
        expect(instance.shouldExecute([])).toEqual(false);
      });

      it('should return false if tick is greater than 0 and no dependency has changed', () => {
        instance.tick++;
        expect(instance.shouldExecute(['value'])).toEqual(false);
      });

      it('should return true if tick is greater than 0 and a dependency has changed', () => {
        expect(instance.shouldExecute(['value'])).toEqual(true);
        expect(instance.shouldExecute(['new value'])).toEqual(true);
        expect(instance.shouldExecute(['new value'])).toEqual(false);
        expect(instance.shouldExecute(['another new value'])).toEqual(true);
      });

      it('should return true if tick is greater than 0 and the length of the dependency array changes', () => {
        expect(instance.shouldExecute(['value'])).toEqual(true);
        expect(instance.shouldExecute(['value', 'new value'])).toEqual(true);
        expect(instance.shouldExecute(['value', 'new value'])).toEqual(false);
        expect(instance.shouldExecute(['value', 'another new value'])).toEqual(true);
      });
    });
  });
});
