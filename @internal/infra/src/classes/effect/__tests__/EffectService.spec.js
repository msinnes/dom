import { RemovableService } from '../../base/RemovableService';
import { InstanceEffects } from '../InstanceEffects';

import { EffectService } from '../EffectService';

describe('EffectService', () => {
  it('should be a class', () => {
    expect(EffectService).toBeAClass();
  });

  it('should extend RemovableService', () => {
    expect(EffectService).toExtend(RemovableService);
  });

  describe('instance', () => {
    let instance;
    beforeEach(() => {
      instance = new EffectService();
    });

    it('should have an empty array of destroyedInstances', () => {
      expect(instance.destroyedInstances).toBeInstanceOf(Array);
      expect(instance.destroyedInstances.length).toEqual(0);
    });

    it('should have an empty array of classEffects', () => {
      expect(instance.classEffects).toBeInstanceOf(Array);
      expect(instance.classEffects.length).toEqual(0);
    });

    describe('addClassEffect', () => {
      it('should be a function', () => {
        expect(instance.addClassEffect).toBeInstanceOf(Function);
      });

      it('should add a class effect to the array of class effects', () => {
        const fn = () => {};
        instance.addClassEffect(fn);
        expect(instance.classEffects.length).toEqual(1);
        expect(instance.classEffects[0].fn).toBe(fn);
      });
    });

    describe('addEffect', () => {
      it('should be a function', () => {
        expect(instance.addEffect).toBeInstanceOf(Function);
      });

      it('should add an effect to the correct context', () => {
        const ref = {};
        const mockEffectFn = jest.fn();
        instance.createEntity(ref);
        const createdEffect = instance.addEffect(ref, mockEffectFn);
        const instanceEffects = instance.entities[0];
        expect(instanceEffects.effects.length).toEqual(1);
        expect(instanceEffects.effects[0]).toBe(createdEffect);
        expect(instanceEffects.effects[0].fn).toBe(mockEffectFn);
      });

      it('should pass an optional conditions array if one is passed', () => {
        const ref = {};
        const mockEffectFn = jest.fn();
        const mockDependencies = [];
        instance.createEntity(ref);
        const createdEffect = instance.addEffect(ref, mockEffectFn, mockDependencies);
        const instanceEffects = instance.entities[0];
        expect(instanceEffects.effects.length).toEqual(1);
        expect(instanceEffects.effects[0]).toBe(createdEffect);
        expect(instanceEffects.effects[0].fn).toBe(mockEffectFn);
        expect(instanceEffects.effects[0].dependencies).toBe(mockDependencies);
      });
    });

    describe('createEntity', () => {
      it('should be a function', () => {
        expect(instance.createEntity).toBeInstanceOf(Function);
      });

      it('should take an instance and create a hook context', () => {
        const componentInstanceRef = {};
        instance.createEntity(componentInstanceRef);
        expect(instance.indexes.length).toEqual(1);
        expect(instance.entities.length).toEqual(1);
        expect(instance.indexes[0]).toBe(componentInstanceRef);
        expect(instance.entities[0]).toBeInstanceOf(InstanceEffects);
      });
    });

    describe('destroyInstance', () => {
      it('should be a function', () => {
        expect(instance.destroyInstance).toBeInstanceOf(Function);
      });

      it('should remove an instance and context, adding the context to the destroyedContexts array', () => {
        const ref1 = {};
        const ref2 = {};
        instance.createEntity(ref1);
        instance.createEntity(ref2);
        const instanceEffects1 = instance.entities[0];
        const instanceEffects2 = instance.entities[1];
        instance.destroyInstance(ref2);
        expect(instance.indexes.length).toEqual(1);
        expect(instance.indexes[0]).toBe(ref1);
        expect(instance.entities.length).toEqual(1);
        expect(instance.entities[0]).toBe(instanceEffects1);
        instance.destroyInstance(ref1);
        expect(instance.indexes.length).toEqual(0);
        expect(instance.entities.length).toEqual(0);

        expect(instance.destroyedInstances.length).toEqual(2);
        expect(instance.destroyedInstances[0]).toBe(instanceEffects2);
        expect(instance.destroyedInstances[1]).toBe(instanceEffects1);
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
        instance.createEntity(ref1);
        instance.createEntity(ref2);
        instance.entities[0].executeEffects = mockExecuteEffectsFn;
        instance.entities[0].cleanupEffects = mockCleanupEffectsFn;
        instance.entities[1].executeEffects = mockExecuteEffectsFn;
        instance.entities[1].cleanupEffects = mockCleanupEffectsFn;
      });

      it('should be a function', () => {
        expect(instance.digest).toBeInstanceOf(Function);
      });

      it('should run executeEffects on all active contexts', () => {
        instance.digest();
        expect(mockExecuteEffectsFn).toHaveBeenCalledTimes(2);
        expect(mockCleanupEffectsFn).not.toHaveBeenCalled();
      });

      it('should run cleanupEffects on all destroyedInstances and reset the destroyedInstances array', () => {
        instance.destroyInstance(ref1);
        instance.destroyInstance(ref2);
        instance.digest();
        expect(mockExecuteEffectsFn).not.toHaveBeenCalled();
        expect(mockCleanupEffectsFn).toHaveBeenCalledTimes(2);
        expect(instance.destroyedInstances.length).toEqual(0);
      });

      it('should execute all of the class effects and reset the classEffects array', () => {
        const fn = jest.fn();
        instance.addClassEffect(fn);
        instance.addClassEffect(fn);
        instance.digest();
        expect(fn).toHaveBeenCalledTimes(2);
        expect(instance.classEffects.length).toEqual(0);
      });
    });
  });
});
