import { BaseRenderController } from '@internal/base/BaseRenderController';
import { BaseAppRenderer } from '@internal/app/AppRenderer';
import { DomRenderer } from '@internal/dom/DomRenderer';

import { BaseSsrRenderController } from '../BaseSsrRenderController';
import { SsrContext } from '../SsrContext';

class TestSsrRenderController extends BaseSsrRenderController {}

describe('BaseSsrRenderController', () => {
  it('should be a class', () => {
    expect(BaseSsrRenderController).toBeAClass();
  });

  describe('instance', () => {
    let instance;
    beforeEach(() => {
      const ctx = new SsrContext();
      ctx.enable();
      instance = new TestSsrRenderController('render', ctx);
      ctx.disable();
    });

    it('should be an instance of BaseRenderController', () => {
      expect(instance).toBeInstanceOf(BaseRenderController);
    });

    it('should have a ctx prop', () => {
      expect(instance.ctx).toBeInstanceOf(SsrContext);
    });

    it('should have an appRenderer', () => {
      expect(instance.appRenderer).toBeInstanceOf(BaseAppRenderer);
    });

    it('should have a domRenderer', () => {
      expect(instance.domRenderer).toBeInstanceOf(DomRenderer);
    });

    describe('render', () => {
      it('should be a function', () => {
        expect(instance.render).toBeInstanceOf(Function);
      });

      it('should enable the context, render the app, render the dom, and disable the context', () => {
        const enableContextMock = jest.spyOn(instance.ctx, 'enable');
        const disableContextMock = jest.spyOn(instance.ctx, 'disable');

        const renderAppMock = jest.fn();
        const renderDomMock = jest.fn();

        instance.renderApp = renderAppMock;
        instance.renderDom = renderDomMock;

        instance.render();
        expect(enableContextMock).toHaveBeenCalledTimes(1);
        expect(renderAppMock).toHaveBeenCalledTimes(1);
        expect(renderDomMock).toHaveBeenCalledTimes(1);
        expect(disableContextMock).toHaveBeenCalledTimes(1);
      });
    });
  });
});