import { BaseBrowserRenderController } from '@new-internal/base';
import { DomRef } from '@new-internal/dom';

import { RenderController } from '../RenderController';

describe('RenderController', () => {
  it('should be a class', () => {
    expect(RenderController).toBeAClass();
  });

  it('should extends BaseBrowserRenderController', () => {
    expect(RenderController).toExtend(BaseBrowserRenderController);
  });

  describe('instance', () => {
    let renderRef;
    let anchorRef;

    let instance;

    beforeEach(() => {
      renderRef = {};
      anchorRef = {};
      instance = new RenderController(renderRef, new DomRef(anchorRef));
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
        let renderMock = jest.fn();
        instance.render = renderMock;
        instance.bootstrap();
        expect(renderMock).toHaveBeenCalledTimes(1);
      });
    });
  });
});
