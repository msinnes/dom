/**
 * @jest-environment jsdom
 */
import { createRender } from '@internal/render';
import { TextNode } from '@internal/dom';

import { DomComponent } from '../base/DomComponent';

import { TextComponent } from '../TextComponent';

describe('TextComponent', () => {
  it('should be a class', () => {
    expect(TextComponent).toBeAClass();
  });

  it('should extend DomComponent', () => {
    expect(TextComponent).toExtend(DomComponent);
  });

  describe('instance', () => {
    let instance;
    let addValueMock;
    let domContext;
    beforeEach(() => {
      addValueMock = jest.fn();
      domContext = {
        addValue: addValueMock,
        value: {
          increment: () => {},
        },
      };
      instance = new TextComponent('text');
      instance.domContext = domContext;
    });

    it('should set the correct component flags', () => {
      expect(instance.isJSXComponent).toBe(true);
      expect(instance.isDomComponent).toBe(true);
      expect(instance.isTextComponent).toBe(true);
    });

    it('should set a text prop', () => {
      expect(instance.text).toEqual('text');
    });

    it('should have an elem prop', () => {
      expect(instance.elem).toBeInstanceOf(TextNode);
      expect(instance.elem.elem.textContent).toEqual('text');
    });

    describe('canUpdate', () => {
      it('should be a function', () => {
        expect(instance.canUpdate).toBeInstanceOf(Function);
      });

      it('should be able to update if the next render is an text render', () => {
        let render = createRender('string');
        expect(instance.canUpdate(render)).toBe(true);
        render = createRender({ signature: function () {}, props: {} });
        expect(instance.canUpdate(render)).toBe(false);
        render = createRender([]);
        expect(instance.canUpdate(render)).toBe(false);
        render = createRender();
        expect(instance.canUpdate(render)).toBe(false);
      });
    });

    describe('render', () => {
      it('should be a function', () => {
        expect(instance.render).toBeInstanceOf(Function);
      });

      it('should return the text prop from render', () => {
        expect(instance.render()).toEqual('text');
      });

      it('should not call the super.render method', () => {
        instance.render();
        expect(addValueMock).not.toHaveBeenCalled();
      });
    });

    describe('update', () => {
      it('should be a function', () => {
        expect(instance.update).toBeInstanceOf(Function);
      });

      it('should update the component\'s props', () => {
        instance.update('new text');
        expect(instance.text).toEqual('new text');
      });

      it('should update the elem textContent', () => {
        instance.update('new text');
        expect(instance.elem.elem.textContent).toEqual('new text');
      });
    });
  });
});
