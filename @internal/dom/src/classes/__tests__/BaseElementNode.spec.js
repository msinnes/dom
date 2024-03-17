import { BaseDomNode } from '../BaseDomNode';

import { BaseElementNode } from '../BaseElementNode';

const createMock = jest.fn();
const updateMock = jest.fn();

class TestableBaseElementNode extends BaseElementNode {
  create(...args) {
    return createMock(...args);
  }
  update(...args) {
    updateMock(...args);
  }
}

describe('BaseElementNode', () => {
  afterEach(jest.resetAllMocks);

  it('should be a class', () => {
    expect(BaseElementNode).toBeAClass();
  });

  it('should be abstract', () => {
    expect(BaseElementNode).toBeAbstract();
  });

  it('should extend BaseDomNode', () => {
    expect(BaseElementNode).toExtend(BaseDomNode);
  });

  it('should have an abstract create method', () => {
    class CreateTestableBaseElementNode extends BaseElementNode {
      update() {}
    }
    expect(CreateTestableBaseElementNode).toHaveAbstractMethod('create');
  });

  it('should have an abstract update method', () => {
    class UpdateTestableBaseElementNode extends BaseElementNode {
      create() {}
    }
    expect(UpdateTestableBaseElementNode).toHaveAbstractMethod('update');
  });

  describe('instance', () => {
    let elem;
    let ref;
    let instance;
    beforeEach(() => {
      elem = { tagName: 'DIV' };
      ref = { elem };
      createMock.mockReturnValue(ref);
      instance = new TestableBaseElementNode(ref);
    });

    it('should have called the createMock to create elem', () => {
      expect(createMock).toHaveBeenCalledTimes(1);
      expect(createMock).toHaveBeenCalledWith(ref);
      expect(instance.elem).toBe(elem);
    });

    it('should have a tag prop', () => {
      expect(instance.tag).toEqual('div');
    });
  });
});
