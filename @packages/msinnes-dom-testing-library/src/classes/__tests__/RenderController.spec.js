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

    let enableMock;
    let digestEffectsMock;
    let disableMock;

    let instance;

    beforeEach(() => {
      renderRef = {};
      ssrScope = new SsrScope({ dom: {} });
      instance = new RenderController(renderRef, ssrScope);
      enableMock = jest.spyOn(instance.scope, 'enable');
      digestEffectsMock = jest.spyOn(instance.scope.services, 'digestEffects');
      disableMock = jest.spyOn(instance.scope, 'disable');
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

    describe('processEffects', () => {
      it('should be a function', () => {
        expect(instance.processEffects).toBeInstanceOf(Function);
      });

      it('should process any effects withing the instane scope', () => {
        instance.processEffects();
        expect(enableMock).toHaveBeenCalledTimes(1);
        expect(digestEffectsMock).toHaveBeenCalledTimes(1);
        expect(disableMock).toHaveBeenCalledTimes(1);
      });

      it('should process frames and rerender if there are frames after processing the effects', () => {
        instance.queue = [];
        const renderFrameMock = jest.spyOn(instance, 'renderFrame').mockImplementation(() => {
          instance.queue.pop();
        });
        digestEffectsMock.mockImplementationOnce(() => {
          instance.queue.push({});
        });
        instance.processEffects();
        expect(renderFrameMock).toHaveBeenCalledTimes(1);
        expect(enableMock).toHaveBeenCalledTimes(3);
        expect(digestEffectsMock).toHaveBeenCalledTimes(2);
        expect(disableMock).toHaveBeenCalledTimes(3);
      });

      it('should throw an error if an infinite loop runs', () => {
        instance.queue = [];
        const renderFrameMock = jest.spyOn(instance, 'renderFrame').mockImplementation(() => {
          instance.queue.pop();
        });
        digestEffectsMock.mockImplementation(() => {
          instance.queue.push({});
        });
        expect(() => instance.processEffects()).toThrow('ImplementationError: Maximum call depth exceeded');
        expect(renderFrameMock).toHaveBeenCalledTimes(50);
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
