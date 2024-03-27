import { BaseServerRenderController } from '@internal/base';
import { DomRef } from '@internal/dom';

import { RenderScreenController } from '../RenderScreenController';
import { Screen } from '../Screen';

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
        body: new DomRef(anchorRef),
        hook: jest.fn(),
      };
      instance = new RenderScreenController(renderRef, ssrScopeMock);
    });

    afterEach(jest.resetAllMocks);

    it('should have a renderer prop', () => {
      expect(instance.renderer.root.root).toBe(renderRef);
      expect(instance.renderer.root.elem.elem).toBe(anchorRef);
    });

    it('should have a domString getter', () => {
      expect(instance.domString).toEqual('mock value');
    });

    it('should have a screen getter', () => {
      let screen = instance.screen;
      expect(screen).toBeInstanceOf(Screen);
      expect(screen).toMatchObject({ html: 'mock value' });
    });
  });
});
