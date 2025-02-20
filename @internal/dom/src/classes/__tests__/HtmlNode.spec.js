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


    describe('updateProps', () => {
      it('should be a function', () => {
        expect(instance.updateProps).toBeInstanceOf(Function);
      });

      it('it should set the list attribute if one is passed', () => {
        const spy = jest.spyOn(instance.elem, 'setAttribute');
        const props = { list: 'datalist' };
        instance.updateProps(props);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith('list', 'datalist');
      });

      it('should not set the list attribute if one is not passed', () => {
        const spy = jest.spyOn(instance.elem, 'setAttribute');
        const props = {};
        instance.updateProps(props);
        expect(spy).toHaveBeenCalledTimes(0);
      });

      it('should not set the list attribute if the attribute is not changing', () => {
        const spy = jest.spyOn(instance.elem, 'setAttribute');
        const props = { list: 'datalist' };
        instance.updateProps(props);
        expect(spy).toHaveBeenCalledTimes(1);
        instance.updateProps(props);
        expect(spy).toHaveBeenCalledTimes(1);
      });

      it('should set props on the elem', () => {
        instance.updateProps({ required: true, id: 'elementId' });
        expect(instance.elem.required).toBe(true);
        expect(instance.elem.id).toBe('elementId');
      });

      it('should clear any stale props', () => {
        const props = { list: 'datalist', required: true, onclick: function() {} };
        instance.updateProps(props);
        expect(instance.elem.getAttribute('list')).toBe('datalist');
        expect(instance.elem.required).toBe(true);
        expect(instance.elem.onclick).toBeInstanceOf(Function);
        instance.updateProps({});
        expect(instance.elem.getAttribute('list')).toBe(null);
        expect(instance.elem.required).toBe(null);
        expect(instance.elem.onclick).toBe(null);
      });
    });
  });
});
