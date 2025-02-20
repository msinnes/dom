import { BaseDomNode } from '../BaseDomNode';

import { BaseElementNode } from '../BaseElementNode';

const createMock = jest.fn();
const updatePropsMock = jest.fn();

class TestableBaseElementNode extends BaseElementNode {
  create(...args) {
    return createMock(...args);
  }
  updateProps(...args) {
    updatePropsMock(...args);
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
      updateProps() {}
    }
    expect(CreateTestableBaseElementNode).toHaveAbstractMethod('create');
  });

  it('should have an abstract updateProps method', () => {
    class UpdatePropsTestableBaseElementNode extends BaseElementNode {
      create() {}
    }
    expect(UpdatePropsTestableBaseElementNode).toHaveAbstractMethod('updateProps');
  });

  describe('instance', () => {
    let setAttributeMock;
    let elem;
    let ref;
    let instance;
    beforeEach(() => {
      setAttributeMock = jest.fn();
      elem = { tagName: 'DIV', style: {}, setAttribute: setAttributeMock };
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

    describe('setAttribute', () => {
      it('should be a function', () => {
        expect(instance.setAttribute).toBeInstanceOf(Function);
      });

      it('should call setAttribute on the node elem', () => {
        const data = {};
        instance.setAttribute('attr', data);
        expect(setAttributeMock).toHaveBeenCalledTimes(1);
        expect(setAttributeMock).toHaveBeenCalledWith('attr', data);
      });
    });

    describe('update', () => {
      it('should be a function', () => {
        expect(instance.update).toBeInstanceOf(Function);
      });

      it('should call instance.updateProps without the style prop', () => {
        const inputProps = { style: {}, key1: 'data1', key2: 'data2' };
        instance.update(inputProps);
        expect(updatePropsMock).toHaveBeenCalledTimes(1);
        expect(updatePropsMock.mock.calls[0][0]).toMatchObject({ key1: 'data1', key2: 'data2' });
      });

      it('should pass the style prop to update style', () => {
        const updateStyleMock = jest.spyOn(instance, 'updateStyle').mockImplementation(() => {});
        const inputProps = { style: {} };
        instance.update(inputProps);
        expect(updateStyleMock).toHaveBeenCalledTimes(1);
        expect(updateStyleMock).toHaveBeenCalledWith(inputProps.style);
      });
    });

    describe('updateStyle', () => {
      let setAttributeMock;
      let ObjectAssignMock;
      let ObjectAssignOriginal;

      beforeEach(() => {
        setAttributeMock = jest.fn();
        instance.elem.setAttribute = setAttributeMock;
        ObjectAssignOriginal = Object.assign;
        ObjectAssignMock = jest.fn();
        Object.assign = ObjectAssignMock;
      });

      afterEach(() => {
        Object.assign = ObjectAssignOriginal;
      });

      it('should be a function', () => {
        expect(instance.updateStyle).toBeInstanceOf(Function);
      });

      it('should call setAttribute if input style is a string', () => {
        instance.updateStyle('color: blue;');
        expect(setAttributeMock).toHaveBeenCalledTimes(1);
        expect(ObjectAssignMock).toHaveBeenCalledTimes(0);
        expect(setAttributeMock).toHaveBeenCalledWith('style', 'color: blue;');
      });

      it('should call Object.assign if the input style is an object', () => {
        const style = { color: 'blue' };
        instance.updateStyle(style);
        expect(setAttributeMock).toHaveBeenCalledTimes(0);
        expect(ObjectAssignMock).toHaveBeenCalledTimes(1);
        expect(ObjectAssignMock).toHaveBeenCalledWith(instance.elem.style, style);
      });
    });
  });
});
