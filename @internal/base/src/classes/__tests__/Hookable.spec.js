import { Hookable } from '../Hookable';

class TestableHookable extends Hookable {}

describe('Hookable', () => {
  it('should be a class', () => {
    expect(Hookable).toBeAClass();
  });

  it('should be abstract', () => {
    expect(Hookable).toBeAbstract();
  });

  describe('instance', () => {
    let instance;

    beforeEach(() => {
      instance = new TestableHookable();
    });

    it('should have an array of hooks', () => {
      expect(instance.hooks).toBeInstanceOf(Object);
      expect(Object.keys(instance.hooks).length).toEqual(0);
    });

    describe('hook', () => {
      it('should be a function', () => {
        expect(instance.hook).toBeInstanceOf(Function);
      });

      it('should add a listener to the hooks map', () => {
        const mock1 = jest.fn();
        instance.hook('key', mock1);
        expect(instance.hooks['key'].length).toEqual(1);
        expect(instance.hooks['key'][0]).toBe(mock1);
        const mock2 = jest.fn();
        instance.hook('key', mock2);
        expect(instance.hooks['key'].length).toEqual(2);
        expect(instance.hooks['key'][1]).toBe(mock2);
        const mock3 = jest.fn();
        instance.hook('differentKey', mock3);
        expect(instance.hooks['differentKey'].length).toEqual(1);
        expect(instance.hooks['differentKey'][0]).toBe(mock3);
      });
    });

    describe('trigger', () => {
      it('should be a function', () => {
        expect(instance.trigger).toBeInstanceOf(Function);
      });

      it('should execute all hooks', () => {
        const mock1 = jest.fn();
        const mock2 = jest.fn();
        const mock3 = jest.fn();
        instance.hook('key', mock1);
        instance.hook('key', mock2);
        instance.hook('differentKey', mock3);
        instance.trigger();
        expect(mock1).toHaveBeenCalledTimes(0);
        expect(mock2).toHaveBeenCalledTimes(0);
        expect(mock3).toHaveBeenCalledTimes(0);
        instance.trigger('key');
        expect(mock1).toHaveBeenCalledTimes(1);
        expect(mock2).toHaveBeenCalledTimes(1);
        expect(mock3).toHaveBeenCalledTimes(0);
        instance.trigger('differentKey');
        expect(mock1).toHaveBeenCalledTimes(1);
        expect(mock2).toHaveBeenCalledTimes(1);
        expect(mock3).toHaveBeenCalledTimes(1);
      });
    });
  });
});
