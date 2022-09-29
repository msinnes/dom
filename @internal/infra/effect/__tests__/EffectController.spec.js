import { BaseDestroyableController } from '../../base/BaseDestroyableController';
import { EffectContext } from '../EffectContext';

import { EffectController } from '../EffectController';

describe('EffectController', () => {
  it('should be a class', () => {
    expect(EffectController).toBeAClass();
  });

  it('should extend BaseDestroyableController', () => {
    expect(EffectController).toExtend(BaseDestroyableController);
  });

  describe('instance', () => {
    let instance;
    beforeEach(() => {
      instance = new EffectController();
    });

    it('should have a instances array', () => {
      expect(instance.instances).toBeInstanceOf(Array);
      expect(instance.instances.length).toEqual(0);
    });

    it('should have a contexts array', () => {
      expect(instance.contexts).toBeInstanceOf(Array);
      expect(instance.contexts.length).toEqual(0);
    });

    it('should have a destroyedContexts array', () => {
      expect(instance.destroyedContexts).toBeInstanceOf(Array);
      expect(instance.destroyedContexts.length).toEqual(0);
    });

    describe('addEffect', () => {
      it('should be a function', () => {
        expect(instance.addEffect).toBeInstanceOf(Function);
      });

      it('should add an effect to the correct context', () => {
        const ref = {};
        const mockEffectFn = jest.fn();
        instance.createContext(ref);
        const createdEffect = instance.addEffect(ref, mockEffectFn);
        const ctx = instance.contexts[0];
        expect(ctx.effects.length).toEqual(1);
        expect(ctx.effects[0]).toBe(createdEffect);
        expect(ctx.effects[0].fn).toBe(mockEffectFn);
        expect(ctx.effects[0].lastConditions).toBeUndefined();
      });

      it('should pass an optional conditions array if one is passed', () => {
        const ref = {};
        const mockEffectFn = jest.fn();
        const mockConditions = [];
        instance.createContext(ref);
        const createdEffect = instance.addEffect(ref, mockEffectFn, mockConditions);
        const ctx = instance.contexts[0];
        expect(ctx.effects.length).toEqual(1);
        expect(ctx.effects[0]).toBe(createdEffect);
        expect(ctx.effects[0].fn).toBe(mockEffectFn);
        expect(ctx.effects[0].lastConditions).toBe(mockConditions);
      });
    });

    describe('createContext', () => {
      it('should be a function', () => {
        expect(instance.createContext).toBeInstanceOf(Function);
      });

      it('should add a context and index it with the passed instance', () => {
        const ref = {};
        instance.createContext(ref);
        expect(instance.instances[0]).toBe(ref);
        expect(instance.contexts[0]).toBeInstanceOf(EffectContext);
      });
    });

    describe('destroyContext', () => {
      it('should be a function', () => {
        expect(instance.destroyContext).toBeInstanceOf(Function);
      });

      it('should remove an instance and context, adding the context to the destroyedContexts array', () => {
        const ref1 = {};
        const ref2 = {};
        instance.createContext(ref1);
        instance.createContext(ref2);
        const context1 = instance.contexts[0];
        const context2 = instance.contexts[1];
        instance.destroyContext(ref2);
        expect(instance.instances.length).toEqual(1);
        expect(instance.instances[0]).toBe(ref1);
        expect(instance.contexts.length).toEqual(1);
        expect(instance.contexts[0]).toBe(context1);
        instance.destroyContext(ref1);
        expect(instance.instances.length).toEqual(0);
        expect(instance.contexts.length).toEqual(0);

        expect(instance.destroyedContexts.length).toEqual(2);
        expect(instance.destroyedContexts[0]).toBe(context2);
        expect(instance.destroyedContexts[1]).toBe(context1);
      });
    });

    describe('digest', () => {
      let mockExecuteEffectsFn;
      let mockCleanupEffectsFn;
      let ref1;
      let ref2;
      beforeEach(() => {
        mockExecuteEffectsFn = jest.fn();
        mockCleanupEffectsFn = jest.fn();
        ref1 = {};
        ref2 = {};
        instance.createContext(ref1);
        instance.createContext(ref2);
        instance.contexts[0].executeEffects = mockExecuteEffectsFn;
        instance.contexts[0].cleanupEffects = mockCleanupEffectsFn;
        instance.contexts[1].executeEffects = mockExecuteEffectsFn;
        instance.contexts[1].cleanupEffects = mockCleanupEffectsFn;
      });

      it('should be a function', () => {
        expect(instance.digest).toBeInstanceOf(Function);
      });

      it('should run executeEffects on all active contexts', () => {
        instance.digest();
        expect(mockExecuteEffectsFn).toHaveBeenCalledTimes(2);
        expect(mockCleanupEffectsFn).not.toHaveBeenCalled();
      });

      it('should run cleanupEffects on all destroyedContexts and reset the destroyedContexts array', () => {
        instance.destroyContext(ref1);
        instance.destroyContext(ref2);
        instance.digest();
        expect(mockExecuteEffectsFn).not.toHaveBeenCalled();
        expect(mockCleanupEffectsFn).toHaveBeenCalledTimes(2);
        expect(instance.destroyedContexts.length).toEqual(0);
      });
    });
  });
});