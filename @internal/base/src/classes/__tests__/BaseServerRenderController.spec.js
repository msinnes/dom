import { DomRef } from '@internal/dom';
import { BaseRenderController } from '../BaseRenderController';

import { BaseServerRenderController } from '../BaseServerRenderController';

class TestableRenderController extends BaseServerRenderController {}

describe('BaseServerRenderController', () => {
  it('should be a class', () => {
    expect(BaseServerRenderController).toBeAClass();
  });

  it('should extend BaseRenderController', () => {
    expect(BaseServerRenderController).toExtend(BaseRenderController);
  });

  describe('instance', () => {
    let instance;

    let renderRef;
    let bodyRef;
    let servicesRef;
    let ssrScopeRef;
    beforeEach(() => {
      renderRef = {};
      bodyRef = {};
      servicesRef = {
        digestEffects: jest.fn(),
      };
      ssrScopeRef = {
        body: new DomRef(bodyRef),
        enable: jest.fn(),
        disable: jest.fn(),
        services: servicesRef,
      };
      instance = new TestableRenderController(renderRef, ssrScopeRef);
    });

    it('should have a scope prop set to the input ssrScop', () => {
      expect(instance.scope).toBe(ssrScopeRef);
    });

    it('should pass the ssrScope.services to the super constructor', () => {
      expect(instance.services.digestEffects).toBe(servicesRef.digestEffects);
    });

    it('should have a renderer prop with the correct render and anchor', () => {
      expect(instance.renderer.root.root).toBe(renderRef);
      expect(instance.renderer.root.elem.elem).toBe(bodyRef);
    });

    describe('processEffects', () => {
      let digestEffectsMock;
      let rootRenderMock;

      beforeEach(() => {
        digestEffectsMock = instance.scope.services.digestEffects;
        rootRenderMock = jest.spyOn(instance.renderer, 'rootRender').mockImplementation(() => {});
      });

      it('should be a function', () => {
        expect(instance.processEffects).toBeInstanceOf(Function);
      });

      it('should process any effects withing the instane scope', () => {
        instance.processEffects();
        expect(digestEffectsMock).toHaveBeenCalledTimes(1);
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
        expect(rootRenderMock).toHaveBeenCalledTimes(1);
        expect(renderFrameMock).toHaveBeenCalledTimes(1);
        expect(digestEffectsMock).toHaveBeenCalledTimes(2);
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
        expect(rootRenderMock).toHaveBeenCalledTimes(50);
        expect(renderFrameMock).toHaveBeenCalledTimes(50);
      });
    });

    describe('render', () => {
      let processEffectsMock;

      beforeEach(() => {
        processEffectsMock = jest.spyOn(instance, 'processEffects').mockImplementation(() => {});
      });

      it('should be a function', () => {
        expect(instance.render).toBeInstanceOf(Function);
      });

      it('should call scope.enable, super.render, instance.processEffects, and scope.disable', () => {
        const renderMock = jest.fn();
        const componentRenderRef = {};
        const rootFirstChildRef = {};
        const rootRef = { firstChild: rootFirstChildRef, render: () => componentRenderRef };
        instance.renderer.root = rootRef;
        instance.renderer.render = renderMock;
        instance.render();
        expect(ssrScopeRef.enable).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledWith(componentRenderRef, instance.renderer.root, rootFirstChildRef);
        expect(processEffectsMock).toHaveBeenCalledTimes(1);
        expect(processEffectsMock).toHaveBeenCalledWith();
        expect(ssrScopeRef.disable).toHaveBeenCalledTimes(1);
      });
    });
  });
});
