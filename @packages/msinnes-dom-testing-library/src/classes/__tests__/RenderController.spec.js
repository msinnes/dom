import { BaseServerRenderController } from '@internal/base';
import { SsrScope } from '@internal/ssr';

import { RenderController } from '../RenderController';

describe('RenderController', () => {
  it('should be a class', () => {
    expect(RenderController).toBeAClass();
  });

  it('should extends BaseServerRenderController', () => {
    expect(RenderController).toExtend(BaseServerRenderController);
  });

  describe('instance', () => {
    let renderRef;
    let ssrScope;

    let instance;

    beforeEach(() => {
      renderRef = {};
      ssrScope = new SsrScope({ dom: {}, time: {} });
      instance = new RenderController(renderRef, ssrScope);
    });

    it('should have a renderer prop', () => {
      expect(instance.renderer.root.root).toBe(renderRef);
      expect(instance.renderer.root.elem.elem).toBe(ssrScope.body.elem);
    });

    describe('bootstrap', () => {
      it('should be a function', () => {
        expect(instance.bootstrap).toBeInstanceOf(Function);
      });

      it('should call the render method', () => {
        const renderMock = jest.spyOn(instance, 'render').mockImplementation(() => {});
        instance.bootstrap();
        expect(renderMock).toHaveBeenCalledTimes(1);
      });
    });

    describe('render', () => {
      let processEffectsMock;
      let wrapElementMock;
      beforeEach(() => {
        processEffectsMock = jest.spyOn(instance, 'processEffects').mockImplementation(() => {});
        wrapElementMock = jest.spyOn(instance, 'wrapElement').mockImplementation(() => {});
      });

      it('should call wrapElement for all elements in the dom', () => {
        instance.render();
        expect(wrapElementMock).toHaveBeenCalledTimes(1);
        expect(wrapElementMock).toHaveBeenCalledWith(ssrScope.body.elem);
      });

      it('should call processEffects', () => {
        instance.render();
        expect(processEffectsMock).toHaveBeenCalledTimes(1);
      });
    });

    describe('wrapElement', () => {
      it('should be a function', () => {
        expect(instance.wrapElement).toBeInstanceOf(Function);
      });

      it('should take a component and wrap the element event handlers', () => {
        const clickMock = jest.fn();
        const element = {
          onclick: () => clickMock(),
        };
        instance.wrapElement(element);
        expect(element.onclick).not.toBe(clickMock);
      });

      it('should call the mock when the elem is clicked', () => {
        const clickMock = jest.fn();
        const element = {
          onclick: () => clickMock(),
          click: function() {
            this.onclick();
          },
        };
        instance.wrapElement(element);
        element.click();
        expect(clickMock).toHaveBeenCalledTimes(1);
      });

      it('should enable the ssr scope for handler execution', () => {
        const clickMock = jest.fn();
        const element = {
          onclick: () => clickMock(window.location.href),
          click: function() {
            this.onclick();
          },
        };
        instance.wrapElement(element);
        element.click();
        expect(clickMock).toHaveBeenCalledTimes(1);
        expect(clickMock).toHaveBeenCalledWith('about:blank');
      });
    });
  });
});
