/**
 * @jest-environment jsdom
 */
import { DomRef } from '../DomRef';
import { BaseElementNode } from '../BaseElementNode';

import { HtmlNode } from '../HtmlNode';

describe('HtmlNode', () => {
  it('should be a class', () => {
    expect(HtmlNode).toBeAClass();
  });

  it('should extend BaseElementNode', () => {
    expect(HtmlNode).toExtend(BaseElementNode);
  });

  describe('instance', () => {
    let instance;
    beforeEach(() => {
      instance = new HtmlNode('div');
    });

    it('should have a ref prop', () => {
      expect(instance.ref).toBeInstanceOf(DomRef);
      const ref = new DomRef('div');
      instance = new HtmlNode(ref);
      expect(instance.ref).toBe(ref);
    });

    it('should have a tag prop with tag in lower case', () => {
      expect(instance.tag).toEqual('div');
    });

    it('should put an element in the node.elem property', () => {
      const ref = new DomRef('div');
      instance = new HtmlNode(ref);
      expect(instance.elem).toBe(ref.elem);
    });

    describe('create', () => {
      it('should be a function', () => {
        expect(instance.create).toBeInstanceOf(Function);
      });

      it('should create a DomRef if one is passed', () => {
        const domRef = instance.create('div');
        expect(domRef).toBeInstanceOf(DomRef);
        expect(domRef.elem).toBeInstanceOf(HTMLElement);
      });

      it('should pass a non-string if one is passed', () => {
        const ref = {};
        const domRef = instance.create(ref);
        expect(domRef).toBe(ref);
      });
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
