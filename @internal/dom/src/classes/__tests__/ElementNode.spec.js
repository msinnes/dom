/**
 * @jest-environment jsdom
 */
import { DomRef } from '../DomRef';
import { BaseDomNode } from '../BaseDomNode';

import { ElementNode } from '../ElementNode';

describe('ElementNode', () => {
  it('should be a class', () => {
    expect(ElementNode).toBeAClass();
  });

  it('should extend BaseDomNode', () => {
    expect(ElementNode).toExtend(BaseDomNode);
  });

  describe('instance', () => {
    let instance;
    beforeEach(() => {
      instance = new ElementNode('div');
    });

    it('should have a ref prop', () => {
      expect(instance.ref).toBeInstanceOf(DomRef);
      const ref = new DomRef('div');
      instance = new ElementNode(ref);
      expect(instance.ref).toBe(ref);
    });

    it('should have a tag prop with tag in lower case', () => {
      expect(instance.tag).toEqual('div');
    });

    it('should put an element in the node.elem property', () => {
      const ref = new DomRef('div');
      instance = new ElementNode(ref);
      expect(instance.elem).toBe(ref.elem);
    });


    describe('update', () => {
      let ObjectAssignMock;
      let ObjectAssignOriginal;

      beforeEach(() => {
        ObjectAssignOriginal = Object.assign;
        ObjectAssignMock = jest.fn();
        Object.assign = ObjectAssignMock;
      });

      afterEach(() => {
        Object.assign = ObjectAssignOriginal;
      });

      it('should be a function', () => {
        expect(instance.update).toBeInstanceOf(Function);
      });

      it('should call Object.assign with a separate style call', () => {
        const styleProp = {};
        const props = { style: styleProp };
        instance.update(props);
        expect(ObjectAssignMock).toHaveBeenCalledTimes(2);
        expect(ObjectAssignMock.mock.calls[0][0]).toEqual(instance.elem.style);
        expect(ObjectAssignMock.mock.calls[0][1]).toEqual(styleProp);

        expect(ObjectAssignMock.mock.calls[1][0]).toEqual(instance.elem);
        // make sure style is not assigned to element
        expect(ObjectAssignMock.mock.calls[1][1].style).toBeUndefined();
      });

      it('should not call Object.assign if there is no style prop', () => {
        const props = {};
        instance.update(props);
        expect(ObjectAssignMock).toHaveBeenCalledTimes(1);
      });

      it('it should set the list attribute if one is passed', () => {
        const spy = jest.spyOn(instance.elem, 'setAttribute');
        const props = { list: 'datalist' };
        instance.update(props);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith('list', 'datalist');
      });

      it('should not set the list attribute if one is not passed', () => {
        const spy = jest.spyOn(instance.elem, 'setAttribute');
        const props = {};
        instance.update(props);
        expect(spy).toHaveBeenCalledTimes(0);
      });
    });
  });
});
