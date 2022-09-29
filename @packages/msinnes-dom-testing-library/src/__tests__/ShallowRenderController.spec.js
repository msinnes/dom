import { BaseSsrRenderController } from '@internal/ssr/BaseSsrRenderController';
import { SsrContext } from '@internal/ssr/SsrContext';

import { ShallowRenderController } from '../ShallowRenderController';

import * as queries from '../queries';

describe('ShallowRenderController', () => {
  it('should be a class', () => {
    expect(ShallowRenderController).toBeAClass();
  });

  it('should extends BaseSsrRenderController', () => {
    expect(ShallowRenderController).toExtend(BaseSsrRenderController);
  });

  describe('instance', () => {
    let instance;
    let ctx;
    beforeEach(() => {
      ctx = new SsrContext();
      ctx.enable();
      instance = new ShallowRenderController('render', ctx);
      ctx.disable();
    });

    describe('render', () => {
      it('should render to the dom', () => {
        instance.render();
        expect(ctx.dom.dom.window.document.body.innerHTML).toEqual('render');
      });

      it('should return a screen', () => {
        const screen = instance.render();
        expect(screen).toBeDefined();
        expect(screen.container).toBeDefined();
        expect(screen.container).toBe(ctx.dom.dom.window.document.body);
        expect(screen.getByLabelText).toBeDefined();
        expect(screen.getByLabelText).toBeInstanceOf(Function);
        expect(screen.getAllByLabelText).toBeDefined();
        expect(screen.getAllByLabelText).toBeInstanceOf(Function);
        expect(screen.queryAllByLabelText).toBeDefined();
        expect(screen.queryAllByLabelText).toBeInstanceOf(Function);
        expect(screen.getByText).toBeDefined();
        expect(screen.getByText).toBeInstanceOf(Function);
        expect(screen.getAllByText).toBeDefined();
        expect(screen.getAllByText).toBeInstanceOf(Function);
        expect(screen.queryAllByText).toBeDefined();
        expect(screen.queryAllByText).toBeInstanceOf(Function);
      });
    });

    describe('wrapElement', () => {
      it('should be a function', () => {
        expect(instance.wrapElement).toBeInstanceOf(Function);
      });

      it('should take a component and wrap the element event handlers', () => {
        const clickMock = jest.fn();
        const component = {
          elem: {
            elem: {
              onclick: () => clickMock(),
            },
          },
        };
        instance.wrapElement(component);
        expect(component.elem.elem.onclick).not.toBe(clickMock);
      });

      it('should call the mock when the elem is clicked', () => {
        const clickMock = jest.fn();
        const component = {
          elem: {
            elem: {
              onclick: () => clickMock(),
              click: function() {
                this.onclick();
              },
            },
          },
        };
        instance.wrapElement(component);
        component.elem.elem.click();
        expect(clickMock).toHaveBeenCalledTimes(1);
      });
    });
  });
});