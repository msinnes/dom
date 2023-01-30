import { BaseServerRenderController } from '@new-internal/base';
import { DomRef } from '@new-internal/dom';

import { RenderToStringController } from '../RenderToStringController';

jest.mock('../../fns/domStringBuilder', () => ({
  renderComponent: jest.fn(),
}));

describe('RenderToStringController', () => {
  it('should be a class', () => {
    expect(RenderToStringController).toBeAClass();
  });

  it('should extends BaseServerRenderController', () => {
    expect(RenderToStringController).toExtend(BaseServerRenderController);
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
      instance = new RenderToStringController(renderRef, ssrScopeMock);
    });

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
