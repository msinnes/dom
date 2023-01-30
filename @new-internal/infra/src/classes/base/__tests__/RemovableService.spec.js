import { BaseService } from '../BaseService';

import { RemovableService } from '../RemovableService';

class TestService extends RemovableService {
  createEntity() {}
}

describe('RemovableService', () => {
  it('should be a class', () => {
    expect(RemovableService).toBeAClass();
  });

  it('should be abstract', () => {
    expect(RemovableService).toBeAbstract();
  });

  it('should extends BaseService', () => {
    expect(RemovableService).toExtend(BaseService);
  });

  it('should have an abstract createEntity method', () => {
    expect(RemovableService).toHaveAbstractMethod('createEntity');
  });

  describe('instance', () => {
    let instance;

    beforeEach(() => {
      instance = new TestService();
    });

    describe('removeAt', () => {
      it('should be a function', () => {
        expect(instance.removeAt).toBeInstanceOf(Function);
      });

      it('should remove an instance and context by input index', () => {
        const index1 = {};
        const entity1 = {};
        const index2 = {};
        const entity2 = {};
        const index3 = {};
        const entity3 = {};
        instance.push(index1, entity1);
        instance.push(index2, entity2);
        instance.push(index3, entity3);
        instance.removeAt(1);
        expect(instance.indexes).toMatchObject([index1, index3]);
        expect(instance.entities).toMatchObject([entity1, entity3]);
      });
    });
  });
});