import { BaseController } from '../BaseController';

import { BaseDestroyableController } from '../BaseDestroyableController';

class TestableBaseDestroyableController extends BaseDestroyableController {
  createContext() {}
}

describe('BaseController', () => {
  it('should be a class', () => {
    expect(BaseDestroyableController).toBeAClass();
  });

  it('should be abstract', () => {
    expect(BaseDestroyableController).toHaveAbstractMethod('createContext');
  });

  it('should extend BaseController', () => {
    expect(BaseDestroyableController).toExtend(BaseController);
  });

  describe('instance', () => {
    let instance;

    beforeEach(() => {
      instance = new TestableBaseDestroyableController();
    });

    describe('removeAt', () => {
      it('should be a function', () => {
        expect(instance.removeAt).toBeInstanceOf(Function);
      });

      it('should remove an instance and context by input index', () => {
        const instance1 = {};
        const context1 = {};
        const instance2 = {};
        const context2 = {};
        const instance3 = {};
        const context3 = {};
        instance.push(instance1, context1);
        instance.push(instance2, context2);
        instance.push(instance3, context3);
        instance.removeAt(1);
        expect(instance.instances).toMatchObject([instance1, instance3]);
        expect(instance.contexts).toMatchObject([context1, context3]);
      });
    });
  });
});