import { DomContext } from '../DomContext';
import { InfraContext } from '../InfraContext';

import { SsrContext } from '../SsrContext';

describe('SsrContext', () => {
  it('should be a class', () => {
    expect(SsrContext).toBeAClass();
  });

  describe('instance', () => {
    let instance;
    let domEnableMock;
    let domDisableMock;
    let infraEnableMock;
    let infraDisableMock;
    beforeEach(() => {
      instance = new SsrContext();

      domEnableMock = jest.spyOn(instance.dom, 'enable');
      domDisableMock = jest.spyOn(instance.dom, 'disable');
      infraEnableMock = jest.spyOn(instance.infra, 'enable');
      infraDisableMock = jest.spyOn(instance.infra, 'disable');
    });

    it('should have a dom props', () => {
      expect(instance.dom).toBeDefined();
      expect(instance.dom).toBeInstanceOf(DomContext);
    });

    it('should have a infra props', () => {
      expect(instance.infra).toBeDefined();
      expect(instance.infra).toBeInstanceOf(InfraContext);
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

    describe('config', () => {
      it('should pass config.dom to the DomContext', () => {
        instance = new SsrContext({ dom: { url: 'http://url.com' } });
        expect(instance.dom.dom.window.location.href).toEqual('http://url.com/');
      });
    });
  });
});