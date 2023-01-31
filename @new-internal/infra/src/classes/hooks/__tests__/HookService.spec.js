import { RemovableService } from '../../base/RemovableService';
import { InstanceHooks } from '../InstanceHooks';

import { HookService } from '../HookService';

describe('HookService', () => {
  it('should be a class', () => {
    expect(HookService).toBeAClass();
  });

  it('should extend RemovableService', () => {
    expect(HookService).toExtend(RemovableService);
  });

  describe('instance', () => {
    let instance;
    beforeEach(() => {
      instance = new HookService();
    });

    it('should have an active context prop set to null', () => {
      expect(instance.activeInstance).toBe(null);
    });

    describe('closeActiveInstance', () => {
      let comp1Ref;
      let comp2Ref;
      let comp3Ref;
      beforeEach(() => {
        comp1Ref = {};
        comp2Ref = {};
        comp3Ref = {};
        instance.createEntity(comp1Ref);
        instance.createEntity(comp2Ref);
        instance.createEntity(comp3Ref);
      });

      it('should be a function', () => {
        expect(instance.closeActiveInstance).toBeInstanceOf(Function);
      });

      it('should call the finish method on the active context and set the active context to null', () => {
        const finishMock = jest.fn();
        instance.entities[1].finish = finishMock;
        instance.setActiveInstance(comp2Ref);
        instance.closeActiveInstance();
        expect(finishMock).toHaveBeenCalledTimes(1);
        expect(instance.activeInstance).toBe(null);
      });

      it('should throw an error if there is no active context', () => {
        expect(() => {
          instance.closeActiveInstance();
        }).toThrow('InternalError');
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
        expect(instance.entities[0]).toBeInstanceOf(InstanceHooks);
      });
    });

    describe('destroyInstance', () => {
      let comp1Ref;
      let comp2Ref;
      let comp3Ref;
      beforeEach(() => {
        comp1Ref = {};
        comp2Ref = {};
        comp3Ref = {};
        instance.createEntity(comp1Ref);
        instance.createEntity(comp2Ref);
        instance.createEntity(comp3Ref);
      });

      it('should be a function', () => {
        expect(instance.destroyInstance).toBeInstanceOf(Function);
      });

      it('should take an instance and destroy the associated hook context', () => {
        expect(instance.indexes.length).toEqual(3);
        expect(instance.entities.length).toEqual(3);
        const ctx1 = instance.entities[0];
        const ctx2 = instance.entities[1];
        const ctx3 = instance.entities[2];
        instance.destroyInstance(comp2Ref);
        expect(instance.indexes.length).toEqual(2);
        expect(instance.entities.length).toEqual(2);
        expect(instance.indexes[0]).toBe(comp1Ref);
        expect(instance.indexes[1]).toBe(comp3Ref);
        expect(instance.entities[0]).toBe(ctx1);
        expect(instance.entities[1]).toBe(ctx3);
      });

      it('should throw an error if the input instance is not found', () => {
        const notInArrRef = {};
        expect(() => {
          instance.destroyInstance(notInArrRef);
        }).toThrow('InternalError');
      });
    });

    describe('getHook', () => {
      let comp1Ref;
      let comp2Ref;
      let comp3Ref;
      beforeEach(() => {
        comp1Ref = {};
        comp2Ref = {};
        comp3Ref = {};
        instance.createEntity(comp1Ref);
        instance.createEntity(comp2Ref);
        instance.createEntity(comp3Ref);
      });

      it('should be a function', () => {
        expect(instance.getHook).toBeInstanceOf(Function);
      });

      it('should call and return the next method on the active hook context', () => {
        const nextMock = jest.fn();
        instance.entities[1].next = nextMock;
        instance.setActiveInstance(comp2Ref);
        const nextReturnRef = {};
        nextMock.mockImplementation(() => nextReturnRef);
        const result = instance.getHook();
        expect(nextMock).toHaveBeenCalledTimes(1);
        expect(result).toBe(nextReturnRef);
      });

      it('should pass the initialValue to the nextMock if one is passed', () => {
        const nextMock = jest.fn();
        instance.entities[1].next = nextMock;
        instance.setActiveInstance(comp2Ref);
        instance.getHook('initialValue');
        expect(nextMock).toHaveBeenCalledTimes(1);
        expect(nextMock).toHaveBeenCalledWith('initialValue');
      });

      it('should throw an error if there is no active context', () => {
        expect(() => {
          instance.getHook();
        }).toThrow('InternalError');
      });
    });

    describe('setActiveInstance', () => {
      let comp1Ref;
      let comp2Ref;
      let comp3Ref;
      beforeEach(() => {
        comp1Ref = {};
        comp2Ref = {};
        comp3Ref = {};
        instance.createEntity(comp1Ref);
        instance.createEntity(comp2Ref);
        instance.createEntity(comp3Ref);
      });

      it('should be a function', () => {
        expect(instance.setActiveInstance).toBeInstanceOf(Function);
      });

      it('should take an instance and set the active hook context', () => {
        expect(instance.indexes.length).toEqual(3);
        expect(instance.entities.length).toEqual(3);
        const hooks = instance.entities[1];
        instance.setActiveInstance(comp2Ref);
        expect(instance.activeInstance).toBe(hooks);
      });

      it('should throw an error if the instance is not found', () => {
        const notInArrRef = {};
        expect(() => {
          instance.setActiveInstance(notInArrRef);
        }).toThrow('InternalError');
      });
    });
  });
});