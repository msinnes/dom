import { BaseService } from '../BaseService';

class TestService extends BaseService {
  createEntity() {}
}

describe('BaseService', () => {
  it('should be a class', () => {
    expect(BaseService).toBeAClass();
  });

  it('should be abstract', () => {
    expect(BaseService).toBeAbstract();
  });

  it('should have an abstract createEntity method', () => {
    expect(BaseService).toHaveAbstractMethod('createEntity');
  });

  describe('instance', () => {
    let instance;
    beforeEach(() => {
      instance = new TestService();
    });

    it('should have an array of entities', () => {
      expect(instance.entities).toBeInstanceOf(Array);
      expect(instance.entities.length).toBe(0);
    });

    it('should have an array of indexes', () => {
      expect(instance.indexes).toBeInstanceOf(Array);
      expect(instance.indexes.length).toBe(0);
    });

    describe('findIdx', () => {
      it('should be a function', () => {
        expect(instance.findIdx).toBeInstanceOf(Function);
      });

      it('should find the index of the input instance', () => {
        const indexRef = {};
        instance.indexes.push(indexRef);
        expect(instance.findIdx(indexRef)).toBe(0);
        expect(instance.findIdx({})).toBe(-1);
      });
    });

    describe('lookup', () => {
      it('should be a function', () => {
        expect(instance.lookup).toBeInstanceOf(Function);
      });

      it('get the context by input instance', () => {
        const indexRef = {};
        const entityRef = {};
        instance.push(indexRef, entityRef);
        expect(instance.lookup(indexRef)).toBe(entityRef);
      });

      it('should return undefined if the instance is not found', () => {
        const indexRef = {};
        const entityRef = {};
        instance.push(indexRef, entityRef);
        expect(instance.lookup({})).toBeUndefined();
      });
    });

    describe('push', () => {
      it('should be a function', () => {
        expect(instance.push).toBeInstanceOf(Function);
      });

      it('should push the input instance in the instances array and push the input context to the contexts array', () => {
        const indexRef = {};
        const entityRef = {};
        instance.push(indexRef, entityRef);
        expect(instance.entities[0]).toBe(entityRef);
        expect(instance.indexes[0]).toBe(indexRef);
      });
    });
  });
});
