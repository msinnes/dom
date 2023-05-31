import { DigestibleScope } from '../DigestibleScope';

import { HookableScope } from '../HookableScope';

class TestableHookableScope extends HookableScope {
  enable() {}
  digest() {}
  disable() {}
}

describe('HookableScope', () => {
  it('should be a class', () => {
    expect(HookableScope).toBeAClass();
  });

  it('should be abstract', () => {
    expect(HookableScope).toBeAbstract();
  });

  it('should extend DigestableScope', () => {
    expect(HookableScope).toExtend(DigestibleScope);
  });

  describe('instance', () => {
    let instance;

    beforeEach(() => {
      instance = new TestableHookableScope();
    });

    it('should have an array of hooks', () => {
      expect(instance.hooks).toBeInstanceOf(Array);
    });

    describe('hook', () => {
      it('should be a function', () => {
        expect(instance.hook).toBeInstanceOf(Function);
      });

      it('should add a listener to the hooks array', () => {
        const mock = jest.fn();
        instance.hook(mock);
        expect(instance.hooks.length).toEqual(1);
        expect(instance.hooks[0]).toBe(mock);
      });
    });

    describe('trigger', () => {
      it('should be a function', () => {
        expect(instance.trigger).toBeInstanceOf(Function);
      });

      it('should execute all hooks', () => {
        const mock1 = jest.fn();
        const mock2 = jest.fn();
        instance.hook(mock1);
        instance.hook(mock2);
        instance.trigger();
        expect(mock1).toHaveBeenCalledTimes(1);
        expect(mock2).toHaveBeenCalledTimes(1);
      });
    });
  });
});
