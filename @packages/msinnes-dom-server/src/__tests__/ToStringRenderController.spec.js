import { SsrContext } from '@internal/ssr/SsrContext';
import { BaseSsrRenderController } from '@internal/ssr/BaseSsrRenderController';

import { ToStringRenderController } from '../ToStringRenderController';

describe('ToStringRenderController', () => {
  it('should be a class', () => {
    expect(ToStringRenderController).toBeInstanceOf(Function);
  });

  describe('instance', () => {
    let instance;
    let ctx;
    beforeEach(() => {
      ctx = new SsrContext();
      ctx.enable();
      instance = new ToStringRenderController('render', ctx);
      ctx.disable();
    });

    it('should be an instance of BaseSsrRenderController', () => {
      expect(instance).toBeInstanceOf(BaseSsrRenderController);
    });

    it('should render to the dom context', () => {
      instance.render();
      expect(instance.ctx.dom.dom.window.document.body.innerHTML).toEqual('render');
    });

    it('should return a rendered string', () => {
      const str = instance.render();
      expect(str).toEqual('render');
    });
  });
});