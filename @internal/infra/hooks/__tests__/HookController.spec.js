import { BaseDestroyableController } from '../../base/BaseDestroyableController';
import { HookContext } from '../HookContext';

import { HookController } from '../HookController';

describe('HookController', () => {
  it('should be a class', () => {
    expect(HookController).toBeAClass();
  });

  it('should extend BaseDestroyableController', () => {
    expect(HookController).toExtend(BaseDestroyableController);
  });

  describe('instance', () => {
    let instance;
    beforeEach(() => {
      instance = new HookController();
    });

    it('should have an array on the instances prop', () => {
      expect(instance.instances).toBeInstanceOf(Array);
    });

    it('should have an array on the contexts prop', () => {
      expect(instance.contexts).toBeInstanceOf(Array);
    });

    it('should have an active context prop set to null', () => {
      expect(instance.activeContext).toBe(null);
    });

    it('should set the instance on a hook context', () => {
      const comp1Ref = {};
      instance.createContext(comp1Ref);
      expect(instance.contexts[0].instance).toBe(comp1Ref);
    });

    describe('closeActiveContext', () => {
      let comp1Ref;
      let comp2Ref;
      let comp3Ref;
      beforeEach(() => {
        comp1Ref = {};
        comp2Ref = {};
        comp3Ref = {};
        instance.createContext(comp1Ref);
        instance.createContext(comp2Ref);
        instance.createContext(comp3Ref);
      });

      it('should be a function', () => {
        expect(instance.closeActiveContext).toBeInstanceOf(Function);
      });

      it('should call the finish method on the active context and set the active context to null', () => {
        const finishMock = jest.fn();
        instance.contexts[1].finish = finishMock;
        instance.setActiveContext(comp2Ref);
        instance.closeActiveContext();
        expect(finishMock).toHaveBeenCalledTimes(1);
        expect(instance.activeContext).toBe(null);
      });

      it('should throw an error if there is no active context', () => {
        let message;
        try {
          instance.closeActiveContext();
        } catch (e) {
          message = e.message;
        }
        expect(message).toBeDefined();
        expect(message.startsWith('InternalError')).toBe(true);
      });
    });

    describe('createContext', () => {
      it('should be a function', () => {
        expect(instance.createContext).toBeInstanceOf(Function);
      });

      it('should take an instance and create a hook context', () => {
        const componentInstanceRef = {};
        instance.createContext(componentInstanceRef);
        expect(instance.instances.length).toEqual(1);
        expect(instance.contexts.length).toEqual(1);
        expect(instance.instances[0]).toBe(componentInstanceRef);
        expect(instance.contexts[0]).toBeInstanceOf(HookContext);
      });
    });

    describe('destroyContext', () => {
      let comp1Ref;
      let comp2Ref;
      let comp3Ref;
      beforeEach(() => {
        comp1Ref = {};
        comp2Ref = {};
        comp3Ref = {};
        instance.createContext(comp1Ref);
        instance.createContext(comp2Ref);
        instance.createContext(comp3Ref);
      });

      it('should be a function', () => {
        expect(instance.destroyContext).toBeInstanceOf(Function);
      });

      it('should take an instance and destroy the associated hook context', () => {
        expect(instance.instances.length).toEqual(3);
        expect(instance.contexts.length).toEqual(3);
        const ctx1 = instance.contexts[0];
        const ctx2 = instance.contexts[1];
        const ctx3 = instance.contexts[2];
        instance.destroyContext(comp2Ref);
        expect(instance.instances.length).toEqual(2);
        expect(instance.contexts.length).toEqual(2);
        expect(instance.instances[0]).toBe(comp1Ref);
        expect(instance.instances[1]).toBe(comp3Ref);
        expect(instance.contexts[0]).toBe(ctx1);
        expect(instance.contexts[1]).toBe(ctx3);
      });

      it('should throw an error if the input instance is not found', () => {
        const notInArrRef = {};
        let message;
        try {
          instance.destroyContext(notInArrRef);
        } catch (e) {
          message = e.message;
        }
        expect(message).toBeDefined();
        expect(message.startsWith('InternalError')).toBe(true);
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
        instance.createContext(comp1Ref);
        instance.createContext(comp2Ref);
        instance.createContext(comp3Ref);
      });

      it('should be a function', () => {
        expect(instance.getHook).toBeInstanceOf(Function);
      });

      it('should call and return the next method on the active hook context', () => {
        const nextMock = jest.fn();
        instance.contexts[1].next = nextMock;
        instance.setActiveContext(comp2Ref);
        const nextReturnRef = {};
        nextMock.mockImplementation(() => nextReturnRef);
        const result = instance.getHook();
        expect(nextMock).toHaveBeenCalledTimes(1);
        expect(result).toBe(nextReturnRef);
      });

      it('should pass the initialValue to the nextMock if one is passed', () => {
        const nextMock = jest.fn();
        instance.contexts[1].next = nextMock;
        instance.setActiveContext(comp2Ref);
        instance.getHook('initialValue');
        expect(nextMock).toHaveBeenCalledTimes(1);
        expect(nextMock).toHaveBeenCalledWith('initialValue');
      });

      it('should throw an error if there is no active context', () => {
        let message;
        try {
          instance.getHook();
        } catch (e) {
          message = e.message;
        }
        expect(message).toBeDefined();
        expect(message.startsWith('InternalError')).toBe(true);
      });
    });

    describe('setActiveContext', () => {
      let comp1Ref;
      let comp2Ref;
      let comp3Ref;
      beforeEach(() => {
        comp1Ref = {};
        comp2Ref = {};
        comp3Ref = {};
        instance.createContext(comp1Ref);
        instance.createContext(comp2Ref);
        instance.createContext(comp3Ref);
      });

      it('should be a function', () => {
        expect(instance.setActiveContext).toBeInstanceOf(Function);
      });

      it('should take an instance and set the active hook context', () => {
        expect(instance.instances.length).toEqual(3);
        expect(instance.contexts.length).toEqual(3);
        const ctx2 = instance.contexts[1];
        instance.setActiveContext(comp2Ref);
        expect(instance.activeContext).toBe(ctx2);
      });

      it('should throw an error if the instance is not found', () => {
        const notInArrRef = {};
        let message;
        try {
          instance.setActiveContext(notInArrRef);
        } catch (e) {
          message = e.message;
        }
        expect(message).toBeDefined();
        expect(message.startsWith('InternalError')).toBe(true);
      });
    });
  });
});
