import { Hook } from '../Hook';

import { InstanceHooks } from '../InstanceHooks';

describe('InstanceHooks', () => {
  it('should be a class', () => {
    expect(InstanceHooks).toBeAClass();
  });

  describe('instance', () => {
    let instance;
    let contextInstanceRef;
    beforeEach(() => {
      contextInstanceRef = {};
      instance = new InstanceHooks(contextInstanceRef);
    });

    it('should have an array on the hooks prop', () => {
      expect(instance.hooks).toBeInstanceOf(Array);
    });

    it('should have 0 on the current prop', () => {
      expect(instance.current).toEqual(0);
    });

    it('should expose the input instance on the instance prop', () => {
      expect(instance.instance).toBe(contextInstanceRef);
    });

    describe('next', () => {
      it('should be a function', () => {
        expect(instance.next).toBeInstanceOf(Function);
      });

      describe('when there is no hook at the current index', () => {
        it('should create a new hook, increment the current index, and return the hook', () => {
          const hook = instance.next();
          expect(hook).toBeInstanceOf(Hook);
          expect(hook.get()).toBeUndefined();
          expect(instance.current).toEqual(1);
        });

        it('should pass the initialValue to the Hook constructor', () => {
          const hook = instance.next('initialValue');
          expect(hook).toBeInstanceOf(Hook);
          expect(hook.get()).toEqual('initialValue');
          expect(instance.current).toEqual(1);
        });

        it('should pass the component isntance to the created hook', () => {
          const hook = instance.next('initialValue');
          expect(hook).toBeInstanceOf(Hook);
          expect(hook.get()).toEqual('initialValue');
          expect(hook.component).toBe(contextInstanceRef);
        });
      });

      describe('when there is a hook at the current index', () => {
        it('should return the next hook', () => {
          instance.next('initialValue');
          instance.finish();
          const hook = instance.next('someOtherValue');
          expect(hook).toBeInstanceOf(Hook);
          expect(hook.get()).toEqual('initialValue');
          expect(instance.current).toEqual(1);
        });
      });
    });

    describe('finish', () => {
      it('should be a function', () => {
        expect(instance.finish).toBeInstanceOf(Function);
      });

      it('should reset the current value to 0', () => {
        instance.next();
        expect(instance.current).toEqual(1);
        instance.finish();
        expect(instance.current).toEqual(0);
      });
    });
  });
});
