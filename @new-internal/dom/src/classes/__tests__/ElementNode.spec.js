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
  });
});
