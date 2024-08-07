import { BaseAppRef } from '@internal/base';

import { DigestibleScope } from '../base/DigestibleScope';
import { DomScope } from '../dom/DomScope';
import { FetchScope } from '../fetch/FetchScope';
import { InfraScope } from '../dom/InfraScope';
import { TimeScope } from '../time/TimeScope';

import { SsrScope } from '../SsrScope';

class AppRef extends BaseAppRef {}

describe('SsrScope', () => {
  it('should be a class', () => {
    expect(SsrScope).toBeAClass();
  });

  it('should extends HookableScope', () => {
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
    let fetchEnableMock;
    let fetchDisableMock;
    beforeEach(() => {
      instance = new SsrScope({ dom: {}, fetch: {}, time: {} }, AppRef);

      domEnableMock = jest.spyOn(instance.dom, 'enable');
      domDisableMock = jest.spyOn(instance.dom, 'disable');
      infraEnableMock = jest.spyOn(instance.infra, 'enable');
      infraDisableMock = jest.spyOn(instance.infra, 'disable');
      // We just want to make sure the mock is called. This is dangerous and we don't need to run it in this case.
      timeEnableMock = jest.spyOn(instance.time, 'enable').mockImplementation(() => {});
      timeDisableMock = jest.spyOn(instance.time, 'disable');
      fetchEnableMock = jest.spyOn(instance.fetch, 'enable');
      fetchDisableMock = jest.spyOn(instance.fetch, 'disable');
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

    it('should have a fetch prop', () => {
      expect(instance.fetch).toBeDefined();
      expect(instance.fetch).toBeInstanceOf(FetchScope);
    });

    it('should expose the window object on a body getter', () => {
      expect(instance.window).toBe(instance.dom.dom.window);
    });

    it('should expose the document object on a body getter', () => {
      expect(instance.document).toBe(instance.dom.dom.window.document);
    });

    it('should expose the body element on a body getter', () => {
      expect(instance.body).toBe(instance.dom.dom.window.document.body);
    });

    it('should expose the container on a container getter', () => {
      expect(instance.container.elem).toBe(instance.dom.dom.window.document.body);
    });

    it('should expose infra.services on a services getter', () => {
      expect(instance.services).toBe(instance.infra.services);
    });

    it('should pass config.dom to the DomScope', () => {
      instance = new SsrScope({ dom: { url: 'http://url.com' }, fetch: {}, time: {} }, AppRef);
      expect(instance.dom.dom.window.location.href).toEqual('http://url.com/');
    });

    it('should pass config.fetch to the FetchScope', () => {
      instance = new SsrScope({ dom: {}, fetch: { digestFetch: true }, time: {} }, AppRef);
      expect(instance.fetch.digestFetch).toBe(true);
      instance = new SsrScope({ dom: {}, fetch: { digestFetch: false }, time: {} }, AppRef);
      expect(instance.fetch.digestFetch).toBe(false);
    });

    it('should pass config.time to the TimeScope', () => {
      instance = new SsrScope({ dom: {}, fetch: {}, time: { digestExpiredTimers: true } }, AppRef);
      expect(instance.time.digestExpiredTimers).toBe(true);
      instance = new SsrScope({ dom: {}, fetch: {}, time: { digestExpiredTimers: false } }, AppRef);
      expect(instance.time.digestExpiredTimers).toBe(false);
    });

    it('should have a url getter', () => {
      expect(instance.url).toBeUndefined();
      instance = new SsrScope({ dom: { url: 'http://url.com' }, fetch: {}, time: {} }, AppRef);
      expect(instance.url).toEqual('http://url.com/');
    });

    it('should override config.fetch.fetch if it is passed', () => {
      const fetchMock = jest.fn();
      instance = new SsrScope({ dom: {}, fetch: { fetch: fetchMock }, time: {} }, AppRef);
      const enableMock = jest.spyOn(instance, 'enable').mockImplementation(() => {});
      const disableMock = jest.spyOn(instance, 'disable').mockImplementation(() => {});
      const doRequest = instance.fetch.doRequest;
      expect(doRequest).toBeInstanceOf(Function);
      const mockReq = {};
      const mockRes = {};
      doRequest(mockReq, mockRes);
      expect(enableMock).toHaveBeenCalledTimes(1);
      expect(disableMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith(mockReq, mockRes);
    });

    it('should be hooked into the fetch schop', () => {
      const mockFn = jest.fn();
      instance.hook('fetchResolve', () => {
        mockFn();
      });
      instance.fetch.trigger('resolve');
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should have an open handles prop', () => {
      instance.fetch.openRequests++;
      expect(instance.openHandles).toEqual(1);
      instance.fetch.openRequests++;
      expect(instance.openHandles).toEqual(2);
      instance.fetch.openRequests--;
      expect(instance.openHandles).toEqual(1);
    });

    describe('createEvent', () => {
      it('should be a function', () => {
        expect(instance.createEvent).toBeInstanceOf(Function);
      });

      it('should create an event', () => {
        const event = instance.createEvent('input');
        expect(event).toBeInstanceOf(instance.window.Event);
      });

      it('should pass a config to the event', () => {
        const event = instance.createEvent('input', { bubbles: true, cancelable: true });
        expect(event.bubbles).toBe(true);
        expect(event.cancelable).toBe(true);
      });
    });

    describe('digest', () => {
      let fn1;
      let fn2;
      let timeDigestMock;
      let fetchDigestMock;
      beforeEach(() => {
        fn1 = () => {};
        fn2 = () => {};
        timeDigestMock = jest.fn().mockReturnValue([fn1]);
        fetchDigestMock = jest.fn().mockReturnValue([fn2]);
        instance.time.digest = timeDigestMock;
        instance.fetch.digest = fetchDigestMock;
      });

      it('should be a function', () => {
        expect(instance.digest).toBeInstanceOf(Function);
      });

      it('should call time.digest', () => {
        instance.digest();
        expect(timeDigestMock).toHaveBeenCalledTimes(1);
        expect(fetchDigestMock).toHaveBeenCalledTimes(1);
      });

      it('should return an array of concatenated handlers', () => {
        const result = instance.digest();
        expect(result.length).toEqual(2);
        expect(result).toMatchObject([fn1, fn2]);
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
        expect(fetchEnableMock).toHaveBeenCalledTimes(1);
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
        expect(fetchDisableMock).toHaveBeenCalledTimes(1);
      });
    });
  });
});
