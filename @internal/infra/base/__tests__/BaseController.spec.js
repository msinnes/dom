import { BaseController } from '../BaseController';

class TestableBaseController extends BaseController {
  createContext() {}
}

describe('BaseController', () => {
  it('should be a class', () => {
    expect(BaseController).toBeAClass();
  });


  it('should have an abstract createContext method', () => {
    class FailTestController extends BaseController {}
    expect(FailTestController).toHaveAbstractMethod('createContext');
  });

  describe('instance', () => {
    let instance;
    beforeEach(() => {
      instance = new TestableBaseController();
    });

    it('should have an array of contexts', () => {
      expect(instance.contexts).toBeInstanceOf(Array);
      expect(instance.contexts.length).toBe(0);
    });

    it('should have an array of instances', () => {
      expect(instance.instances).toBeInstanceOf(Array);
      expect(instance.instances.length).toBe(0);
    });

    describe('findIdx', () => {
      it('should be a function', () => {
        expect(instance.findIdx).toBeInstanceOf(Function);
      });

      it('should find the index of the input instance', () => {
        const instanceRef = {};
        instance.instances.push(instanceRef);
        expect(instance.findIdx(instanceRef)).toBe(0);
        expect(instance.findIdx({})).toBe(-1);
      });
    });

    describe('lookup', () => {
      it('should be a function', () => {
        expect(instance.lookup).toBeInstanceOf(Function);
      });

      it('get the context by input instance', () => {
        const instanceRef = {};
        const contextRef = {};
        instance.push(instanceRef, contextRef);
        expect(instance.lookup(instanceRef)).toBe(contextRef);
      });

      it('should return undefined if the instance is not found', () => {
        const instanceRef = {};
        const contextRef = {};
        instance.push(instanceRef, contextRef);
        expect(instance.lookup({})).toBeUndefined();
      });
    });

    describe('push', () => {
      it('should be a function', () => {
        expect(instance.push).toBeInstanceOf(Function);
      });

      it('should push the input instance in the instances array and push the input context to the contexts array', () => {
        const instanceRef = {};
        const contextRef = {};
        instance.push(instanceRef, contextRef);
        expect(instance.instances[0]).toBe(instanceRef);
        expect(instance.contexts[0]).toBe(contextRef);
      });
    });
  });
});