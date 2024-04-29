import { DigestibleScope } from '../../base/DigestibleScope';
import { SyncPromise } from '../../base/SyncPromise';

import { Requests } from '../request/Requests';

import { FetchScope } from '../FetchScope';

describe('FetchScope', () => {
  it('should be a class', () => {
    expect(FetchScope).toBeAClass();
  });


  it('should extends DigestibleScope', () => {
    expect(FetchScope).toExtend(DigestibleScope);
  });

  describe('instance', () => {
    let instance;

    let fetchOriginal;

    beforeEach(() => {
      instance = new FetchScope({});
      fetchOriginal = global.fetch;
    });

    it('should expose instance.requests.getAll on a getAll getter', () => {
      expect(instance.getAll).toBe(instance.requests.getAll);
    });

    it('should expose instance.requests.getNext on a getNext getter', () => {
      expect(instance.getNext).toBe(instance.requests.getNext);
    });

    it('should have a requests prop', () => {
      expect(instance.requests).toBeInstanceOf(Requests);
    });

    it('should have a digestFetch prop defaulted to true', () => {
      expect(instance.digestFetch).toBe(true);
    });

    it('should default doRequest to a noop', () => {
      const req = {};
      const closeMock = jest.fn();
      const res = { close: closeMock };
      expect(instance.doRequest).toBeInstanceOf(Function);
      expect(instance.doRequest(req, res)).toBeUndefined();
      expect(closeMock).toHaveBeenCalled();
    });

    it('should set digestFetch if a value is passed', () => {
      instance = new FetchScope({ digestFetch: true });
      expect(instance.digestFetch).toBe(true);
      instance = new FetchScope({ digestFetch: false });
      expect(instance.digestFetch).toBe(false);
    });

    it('should set doRequest if a fetch value is passed', () => {
      const mockFn = jest.fn();
      instance = new FetchScope({ fetch: mockFn });
      expect(instance.doRequest).toBe(mockFn);
    });

    it('should have an openRequests prop', () => {
      expect(instance.openRequests).toEqual(0);
    });

    describe('createRequest', () => {
      it('should be a function', () => {
        expect(instance.createRequest).toBeInstanceOf(Function);
      });

      it('should trigger the scope when the promise resolves', () => {
        const triggerSpy = jest.spyOn(instance, 'trigger');
        const mockConfig = {};
        const mockFn = jest.fn();
        instance.requests.create = (url, config, resolve, doRequest) => mockFn(url, config, resolve, doRequest);
        instance.createRequest('url', mockConfig);
        expect(mockFn).toHaveBeenCalledTimes(1);
        expect(mockFn.mock.calls[0][0]).toEqual('url');
        expect(mockFn.mock.calls[0][1]).toEqual(mockConfig);
        expect(mockFn.mock.calls[0][2]).toBeInstanceOf(Function);
        expect(mockFn.mock.calls[0][3]).toBe(instance.doRequest);

        const resolveFn = mockFn.mock.calls[0][2];
        expect(instance.openRequests).toEqual(1);
        const mockData = {};
        resolveFn(mockData);
        expect(instance.openRequests).toEqual(0);
        expect(triggerSpy).toHaveBeenCalledTimes(1);
        expect(triggerSpy).toHaveBeenCalledWith('resolve');
      });

      it('fetch should return a promise', () => {
        const mockFn = jest.fn();
        const mockData = {};
        const promise = instance.createRequest('url');
        promise.then(data => mockFn(data));
        expect(promise).toBeInstanceOf(SyncPromise);
        expect(instance.requests.requests[0].resolve).toBeInstanceOf(Function);
        instance.requests.requests[0].resolve(mockData);
        expect(mockFn).toHaveBeenCalledTimes(1);
        expect(mockFn).toHaveBeenCalledWith(mockData);
      });

      it('should ignore the promise if the scope is closed', () => {
        const triggerSpy = jest.spyOn(instance, 'trigger');
        const mockConfig = {};
        const mockFn = jest.fn();
        instance.requests.create = (url, config, resolve, doRequest) => mockFn(url, config, resolve, doRequest);
        instance.createRequest('url', mockConfig);
        expect(mockFn).toHaveBeenCalledTimes(1);
        expect(mockFn.mock.calls[0][0]).toEqual('url');
        expect(mockFn.mock.calls[0][1]).toEqual(mockConfig);
        expect(mockFn.mock.calls[0][2]).toBeInstanceOf(Function);
        expect(mockFn.mock.calls[0][3]).toBe(instance.doRequest);

        const resolveFn = mockFn.mock.calls[0][2];
        expect(instance.openRequests).toEqual(1);
        const mockData = {};
        instance.close();
        resolveFn(mockData);
        expect(instance.openRequests).toEqual(1);
        expect(triggerSpy).toHaveBeenCalledTimes(0);
      });
    });

    describe('digest', () => {
      it('should be a function', () => {
        expect(instance.digest).toBeInstanceOf(Function);
      });

      it('should make a call to instance.requests.getAll if digestExpiredTimers is true', () => {
        const fn = () => {};
        const getAllMock = jest.fn().mockReturnValue([fn]);
        instance.requests.getAll = getAllMock;
        let results = instance.digest();
        expect(results.length).toEqual(1);
        expect(results[0]).toBe(fn);
        instance = new FetchScope({ digestFetch: false });
        instance.requests.getAll = getAllMock;
        results = instance.digest();
        expect(getAllMock).toHaveBeenCalledTimes(1);
        expect(results.length).toEqual(0);
      });
    });

    describe('enable', () => {
      it('should be a function', () => {
        expect(instance.enable).toBeInstanceOf(Function);
      });

      it('should set global.fetch to a bound requests.requests.create', () => {
        const mockConfig = {};
        const mockFn = jest.fn();
        instance.requests.create = (url, config, resolve, doRequest) => mockFn(url, config, resolve, doRequest);
        instance.enable();
        expect(fetch).toBeDefined();
        expect(fetch).toBeInstanceOf(Function);
        fetch('url', mockConfig);
        expect(mockFn).toHaveBeenCalledTimes(1);
        expect(mockFn.mock.calls[0][0]).toEqual('url');
        expect(mockFn.mock.calls[0][1]).toEqual(mockConfig);
        expect(mockFn.mock.calls[0][2]).toBeInstanceOf(Function);
        expect(mockFn.mock.calls[0][3]).toBe(instance.doRequest);
        instance.disable();
      });

      it('fetch should return a promise', () => {
        const mockFn = jest.fn();
        const mockData = {};
        instance.enable();
        const promise = fetch('url');
        promise.then(data => mockFn(data));
        expect(promise).toBeInstanceOf(SyncPromise);
        expect(instance.requests.requests[0].resolve).toBeInstanceOf(Function);
        instance.requests.requests[0].resolve(mockData);
        expect(mockFn).toHaveBeenCalledTimes(1);
        expect(mockFn).toHaveBeenCalledWith(mockData);
        instance.disable();
      });
    });

    describe('disable', () => {
      it('should be a function', () => {
        expect(instance.disable).toBeInstanceOf(Function);
      });

      it('should delete fetch from the global scope', () => {
        instance.enable();
        expect(fetch).toBeDefined();
        expect(fetch).toBeInstanceOf(Function);
        instance.disable();
        expect(global.fetch).toBe(fetchOriginal);
      });
    });
  });
});
