import { Effect } from '../Effect';

import { InstanceEffects } from '../InstanceEffects';

describe('InstanceEffects', () => {
  it('should be a class', () => {
    expect(InstanceEffects).toBeAClass();
  });

  describe('instance', () => {
    let instance;
    beforeEach(() => {
      instance = new InstanceEffects();
    });

    it('should have an effects prop', () => {
      expect(instance.effects).toBeInstanceOf(Array);
      expect(instance.effects.length).toEqual(0);
    });

    describe('addEffect', () => {
      it('should be a function', () => {
        expect(instance.addEffect).toBeInstanceOf(Function);
      });

      it('should take a function and add an effect to the effects array', () => {
        const mockEffectFn = jest.fn();
        const effect = instance.addEffect(mockEffectFn);
        expect(instance.effects.length).toEqual(1);
        expect(effect).toBeInstanceOf(Effect);
        expect(effect.fn).toBe(mockEffectFn);
        expect(effect.dependencies).toBeUndefined();
      });

      it('should take an optional array and pass it to the effect', () => {
        const mockEffectFn = jest.fn();
        const mockDependencies = [];
        const effect = instance.addEffect(mockEffectFn, mockDependencies);
        expect(instance.effects.length).toEqual(1);
        expect(effect).toBeInstanceOf(Effect);
        expect(effect.fn).toBe(mockEffectFn);
        expect(effect.dependencies).toBe(mockDependencies);
      });
    });

    describe('each', () => {
      let mockEffectFn;
      beforeEach(() => {
        mockEffectFn = jest.fn();
        instance.addEffect(mockEffectFn);
        instance.addEffect(mockEffectFn);
      });

      it('should be a function', () => {
        expect(instance.each).toBeInstanceOf(Function);
      });

      it('should call a callback with every effect', () => {
        const mockFn = jest.fn();
        instance.each(mockFn);
        expect(mockFn).toHaveBeenCalledTimes(2);
        expect(mockFn.mock.calls[0][0]).toBe(instance.effects[0]);
        expect(mockFn.mock.calls[1][0]).toBe(instance.effects[1]);
      });
    });

    describe('executeEffects', () => {
      let mockEffectFn;
      beforeEach(() => {
        mockEffectFn = jest.fn();
        instance.addEffect(mockEffectFn);
        instance.addEffect(mockEffectFn);
      });

      it('should be a function', () => {
        expect(instance.executeEffects).toBeInstanceOf(Function);
      });

      it('should execute all of the effects', () => {
        instance.executeEffects();
        expect(mockEffectFn).toHaveBeenCalledTimes(2);
      });
    });

    describe('cleanupEffects', () => {
      let mockEffectFn;
      let mockCleanupFn;
      beforeEach(() => {
        mockEffectFn = jest.fn();
        mockCleanupFn = jest.fn();
        mockEffectFn.mockImplementation(() => mockCleanupFn);
        instance.addEffect(mockEffectFn);
        instance.addEffect(mockEffectFn);
      });

      it('should be a function', () => {
        expect(instance.cleanupEffects).toBeInstanceOf(Function);
      });

      it('should execute all cleanups', () => {
        instance.cleanupEffects();
        expect(mockCleanupFn).not.toHaveBeenCalled();
        instance.executeEffects();
        instance.cleanupEffects();
        expect(mockCleanupFn).toHaveBeenCalledTimes(2);
      });
    });
  });
});
