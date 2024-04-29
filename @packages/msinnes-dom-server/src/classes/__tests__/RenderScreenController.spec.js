import { BaseServerRenderController } from '@internal/base';
import { DomRef } from '@internal/dom';

import { RenderScreenController } from '../RenderScreenController';

describe('RenderScreenController', () => {
  it('should be a class', () => {
    expect(RenderScreenController).toBeAClass();
  });

  it('should extends BaseServerRenderController', () => {
    expect(RenderScreenController).toExtend(BaseServerRenderController);
  });

  describe('instance', () => {
    let renderRef;
    let anchorRef;
    let ssrScopeMock;

    let instance;

    beforeEach(() => {
      renderRef = {};
      anchorRef = { innerHTML: 'mock value' };
      ssrScopeMock = {
        container: new DomRef(anchorRef),
        hook: jest.fn(),
      };
      instance = new RenderScreenController(renderRef, ssrScopeMock);
    });

    afterEach(jest.resetAllMocks);

    it('should have a renderer prop', () => {
      expect(instance.renderer.root.root).toBe(renderRef);
      expect(instance.renderer.root.elem.elem).toBe(anchorRef);
    });
  });
});
