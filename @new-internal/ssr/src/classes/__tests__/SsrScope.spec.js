import { DomScope } from '../DomScope';

import { InfraScope } from '../InfraScope';
import { SsrScope } from '../SsrScope';

describe('SsrScope', () => {
  it('should be a class', () => {
    expect(SsrScope).toBeAClass();
  });

  describe('instance', () => {
    let instance;
    let domEnableMock;
    let domDisableMock;
    let infraEnableMock;
    let infraDisableMock;
    beforeEach(() => {
      instance = new SsrScope({});

      domEnableMock = jest.spyOn(instance.dom, 'enable');
      domDisableMock = jest.spyOn(instance.dom, 'disable');
      infraEnableMock = jest.spyOn(instance.infra, 'enable');
      infraDisableMock = jest.spyOn(instance.infra, 'disable');
    });

    it('should have a dom prop', () => {
      expect(instance.dom).toBeDefined();
      expect(instance.dom).toBeInstanceOf(DomScope);
    });

    it('should have an infra prop', () => {
      expect(instance.infra).toBeDefined();
      expect(instance.infra).toBeInstanceOf(InfraScope);
    });

    it('should expose the body element on a body getter', () => {
      expect(instance.body.elem).toBe(instance.dom.dom.window.document.body);
    });

    it('should expose infra.services on a services getter', () => {
      expect(instance.services).toBe(instance.infra.services);
    });

    it('should pass config.dom to the DomScope', () => {
      instance = new SsrScope({ dom: { url: 'http://url.com' } });
      expect(instance.dom.dom.window.location.href).toEqual('http://url.com/');
    });

    describe('enable', () => {
      it('should be a function', () => {
        expect(instance.enable).toBeInstanceOf(Function);
      });

      it('should call the enable mocks', () => {
        instance.enable();
        expect(domEnableMock).toHaveBeenCalledTimes(1);
        expect(infraEnableMock).toHaveBeenCalledTimes(1);
      });
    });

    describe('disable', () => {
      it('should be a function', () => {
        expect(instance.disable).toBeInstanceOf(Function);
      });

      it('should call the disable mocks', () => {
        instance.disable();
        expect(domDisableMock).toHaveBeenCalledTimes(1);
        expect(infraDisableMock).toHaveBeenCalledTimes(1);
      });
    });
  });
});
