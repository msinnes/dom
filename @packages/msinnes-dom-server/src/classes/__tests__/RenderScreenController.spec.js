import { BaseServerRenderController } from '@internal/base';
import { DomRef } from '@internal/dom';

import { RenderScreenController } from '../RenderScreenController';
import { Screen } from '../Screen';

jest.mock('../../fns/domStringBuilder', () => ({
  renderComponent: jest.fn(),
}));

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
      anchorRef = {};
      ssrScopeMock = {
        body: new DomRef(anchorRef),
      };
      instance = new RenderScreenController(renderRef, ssrScopeMock);
    });

    afterEach(jest.resetAllMocks);

    it('should have a renderer prop', () => {
      expect(instance.renderer.root.root).toBe(renderRef);
      expect(instance.renderer.root.elem.elem).toBe(anchorRef);
    });

    it('should have a domString getter', () => {
      const { renderComponent: renderComponentMock } = require('../../fns/domStringBuilder');
      renderComponentMock.mockReturnValue('mock value');
      expect(instance.domString).toEqual('mock value');
      expect(renderComponentMock).toHaveBeenCalledTimes(1);
      expect(renderComponentMock).toHaveBeenCalledWith(instance.renderer.root);
    });

    it('should have a screen getter', () => {
      const { renderComponent: renderComponentMock } = require('../../fns/domStringBuilder');
      renderComponentMock.mockReturnValue('mock value');
      let screen = instance.screen;
      expect(screen).toBeInstanceOf(Screen);
      expect(screen).toMatchObject({ html: 'mock value' });
      expect(renderComponentMock).toHaveBeenCalledTimes(1);
      expect(renderComponentMock).toHaveBeenCalledWith(instance.renderer.root);
      ssrScopeMock.url = 'url';
      screen = instance.screen;
      expect(screen).toBeInstanceOf(Screen);
      expect(screen).toMatchObject({ html: 'mock value', url: 'url' });
      expect(renderComponentMock).toHaveBeenCalledTimes(2);
      expect(renderComponentMock).toHaveBeenCalledWith(instance.renderer.root);
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
