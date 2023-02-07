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
        mockFn: jest.fn(),
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
      expect(instance.services.mockFn).toBe(servicesRef.mockFn);
    });

    it('should have a renderer prop with the correct render and anchor', () => {
      expect(instance.renderer.root.root).toBe(renderRef);
      expect(instance.renderer.root.elem.elem).toBe(bodyRef);
    });

    describe('render', () => {
      it('should be a function', () => {
        expect(instance.render).toBeInstanceOf(Function);
      });

      it('should call scope.enable, super.render, and scope.disable', () => {
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
        expect(ssrScopeRef.disable).toHaveBeenCalledTimes(1);
      });
    });
  });
});
