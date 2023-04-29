import { DigestibleScope } from '../base/DigestibleScope';
import { DomScope } from '../dom/DomScope';
import { InfraScope } from '../dom/InfraScope';
import { TimeScope } from '../time/TimeScope';

import { SsrScope } from '../SsrScope';

describe('SsrScope', () => {
  it('should be a class', () => {
    expect(SsrScope).toBeAClass();
  });

  it('should extends DigestibleScope', () => {
    expect(SsrScope).toExtend(DigestibleScope);
  });

  describe('instance', () => {
    let instance;
    let domEnableMock;
    let domDisableMock;
    let infraEnableMock;
    let infraDisableMock;
    let timeEnableMock;
    let timeDisableMock;
    beforeEach(() => {
      instance = new SsrScope({ dom: {}, time: {} });

      domEnableMock = jest.spyOn(instance.dom, 'enable');
      domDisableMock = jest.spyOn(instance.dom, 'disable');
      infraEnableMock = jest.spyOn(instance.infra, 'enable');
      infraDisableMock = jest.spyOn(instance.infra, 'disable');
      // We just want to make sure the mock is called. This is dangerous and we don't need to run it in this case.
      timeEnableMock = jest.spyOn(instance.time, 'enable').mockImplementation(() => {});
      timeDisableMock = jest.spyOn(instance.time, 'disable');
    });

    it('should have a dom prop', () => {
      expect(instance.dom).toBeDefined();
      expect(instance.dom).toBeInstanceOf(DomScope);
    });

    it('should have an infra prop', () => {
      expect(instance.infra).toBeDefined();
      expect(instance.infra).toBeInstanceOf(InfraScope);
    });

    it('should have a time prop', () => {
      expect(instance.time).toBeDefined();
      expect(instance.time).toBeInstanceOf(TimeScope);
    });

    it('should expose the body element on a body getter', () => {
      expect(instance.body.elem).toBe(instance.dom.dom.window.document.body);
    });

    it('should expose infra.services on a services getter', () => {
      expect(instance.services).toBe(instance.infra.services);
    });

    it('should pass config.dom to the DomScope', () => {
      instance = new SsrScope({ dom: { url: 'http://url.com' }, time: {} });
      expect(instance.dom.dom.window.location.href).toEqual('http://url.com/');
    });

    it('should pass config.time to the TimeScope', () => {
      instance = new SsrScope({ dom: {}, time: { runExpiredTimers: true } });
      expect(instance.time.runExpiredTimers).toBe(true);
      instance = new SsrScope({ dom: {}, time: { runExpiredTimers: false } });
      expect(instance.time.runExpiredTimers).toBe(false);
    });

    it('should have a url getter', () => {
      expect(instance.url).toBeUndefined();
      instance = new SsrScope({ dom: { url: 'http://url.com' }, time: {} });
      expect(instance.url).toEqual('http://url.com/');
    });

    describe('digest', () => {
      let fn;
      let timeDigestMock;
      beforeEach(() => {
        fn = () => {};
        timeDigestMock = jest.fn().mockReturnValue([fn]);
        instance.time.digest = timeDigestMock;
      });

      it('should be a function', () => {
        expect(instance.digest).toBeInstanceOf(Function);
      });

      it('should call time.digest', () => {
        instance.digest();
        expect(timeDigestMock).toHaveBeenCalledTimes(1);
      });

      it('should return an array of concatenated handlers', () => {
        const result = instance.digest();
        expect(result.length).toEqual(1);
        expect(result).toMatchObject([fn]);
      });
    });

    describe('enable', () => {
      it('should be a function', () => {
        expect(instance.enable).toBeInstanceOf(Function);
      });

      it('should call the enable mocks', () => {
        instance.enable();
        expect(domEnableMock).toHaveBeenCalledTimes(1);
        expect(infraEnableMock).toHaveBeenCalledTimes(1);
        expect(timeEnableMock).toHaveBeenCalledTimes(1);
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
        expect(timeDisableMock).toHaveBeenCalledTimes(1);
      });
    });
  });
});
