/**
 * @jest-environment jsdom
 */
import { BaseBrowserRenderController } from '@new-internal/base';
import { DomRef } from '@new-internal/dom';

import { HydrateController } from '../HydrateController';

describe('HydrateController', () => {
  it('should be a class', () => {
    expect(HydrateController).toBeAClass();
  });

  it('should extends BaseBrowserRenderController', () => {
    expect(HydrateController).toExtend(BaseBrowserRenderController);
  });

  describe('instance', () => {
    let renderRef;
    let anchorRef;

    let instance;

    beforeEach(() => {
      renderRef = {};
      anchorRef = {};
      instance = new HydrateController(renderRef, new DomRef(anchorRef));
    });

    it('should have a renderer prop', () => {
      expect(instance.renderer.root.root).toBe(renderRef);
      expect(instance.renderer.root.elem.elem).toBe(anchorRef);
    });

    describe('bootstrap', () => {
      it('should be a function', () => {
        expect(instance.bootstrap).toBeInstanceOf(Function);
      });

      it('should call the render function', () => {
        let emptyElementChildrenMock = jest.fn();
        let renderMock = jest.fn();
        instance.emptyElementChildren = emptyElementChildrenMock;
        instance.render = renderMock;
        instance.bootstrap();
        expect(emptyElementChildrenMock).toHaveBeenCalledTimes(1);
        expect(emptyElementChildrenMock).toHaveBeenCalledWith(instance.renderer.root.elem.elem);
        expect(renderMock).toHaveBeenCalledTimes(1);
      });
    });

    describe('emptyElementChildren', () => {
      function createDivWithText(text) {
        const div = document.createElement('div');
        div.innerHTML = text;
        return div;
      }

      it('should be a function', () => {
        expect(instance.emptyElementChildren).toBeInstanceOf(Function);
      });

      it('should empty all element children from the input anchor', () => {
        document.body.appendChild(createDivWithText('text 1'));
        document.body.appendChild(createDivWithText('text 2'));
        expect(document.body.innerHTML).toEqual('<div>text 1</div><div>text 2</div>');
        instance.emptyElementChildren(document.body);
        expect(document.body.innerHTML).toEqual('');
      });

      it('should empty a string child from the input anchor', () => {
        document.body.innerHTML = 'text';
        instance.emptyElementChildren(document.body);
        expect(document.body.innerHTML).toEqual('');
      });
    });
  });
});
