/**
 * @jest-environment jsdom
 */
import { BaseDomNode } from '../BaseDomNode';
import { TextNode } from '../TextNode';
import { TextRef } from '../TextRef';

describe('TextNode', () => {
  it('should be a class', () => {
    expect(TextNode).toBeAClass();
  });

  it('should extend BaseDomNode', () => {
    expect(TextNode).toExtend(BaseDomNode);
  });

  describe('instance', () => {
    let createTextNodeMock;
    let mockTextNode;
    let instance;
    beforeEach(() => {
      mockTextNode = {};
      createTextNodeMock = jest.spyOn(document, 'createTextNode');
      instance = new TextNode('text');
    });

    it('should set an elem', () => {
      expect(instance.elem).toBeInstanceOf(Text);
      expect(instance.elem.textContent).toEqual('text');
    });

    describe('update', () => {
      it('should be a function', () => {
        expect(instance.update).toBeInstanceOf(Function);
      });

      it('should set a ref prop', () => {
        expect(instance.ref).toBeInstanceOf(TextRef);
      });

      it('should update the elem.textContent', () => {
        instance.update('update text');
        expect(instance.elem.textContent).toEqual('update text');
      });
    });
  });
});
