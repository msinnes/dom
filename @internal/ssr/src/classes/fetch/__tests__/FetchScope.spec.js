import { DigestibleScope } from '../../base/DigestibleScope';
import { SyncPromise } from '../../base/SyncPromise';

import { FetchResponse, Response } from '../Response';
import { Request, Requests } from '../Request';

import { FetchScope } from '../FetchScope';

describe('Request', () => {
  it('should be a class', () => {
    expect(Request).toBeAClass();
  });

  describe('instance', () => {
    let instance;

    let mockConfig;
    let mockResolve;
    let mockDoRequest;
    beforeEach(() => {
      mockConfig = {};
      mockResolve = jest.fn();
      mockDoRequest = jest.fn();
      instance = new Request('url', mockConfig, mockResolve, mockDoRequest);
    });

    it('should set the url prop', () => {
      expect(instance.url).toEqual('url');
    });

    it('should set the config prop and default to an empty object', () => {
      expect(instance.config).toBe(mockConfig);
      instance = new Request('url');
      expect(instance.config).toBeInstanceOf(Object);
    });

    it('should set the resolve prop', () => {
      expect(instance.resolve).toBe(mockResolve);
    });

    it('should set the doRequest prop', () => {
      expect(instance.doRequest).toBe(mockDoRequest);
    });

    describe('exec', () => {
      it('should be a function', () => {
        expect(instance.exec).toBeInstanceOf(Function);
      });

      it('should call doRequest with a request and response', () => {
        instance.exec();
        expect(mockDoRequest).toHaveBeenCalledTimes(1);
        expect(mockDoRequest.mock.calls[0][0]).toMatchObject({ url: 'url', config: mockConfig });
        expect(mockDoRequest.mock.calls[0][1]).toBeInstanceOf(FetchResponse);
      });

      it('should resolve the request', () => {
        instance.exec();
        expect(mockResolve).toHaveBeenCalledTimes(1);
        expect(mockResolve.mock.calls[0][0]).toBeInstanceOf(Response);
      });
    });
  });
});

describe('Requests', () => {
  it('should be a class', () => {
    expect(Requests).toBeAClass();
  });

  describe('instance', () => {
    let instance;

    beforeEach(() => {
      instance = new Requests();
    });

    it('should have an array of requests', () => {
      expect(instance.requests).toBeInstanceOf(Array);
    });

    describe('create', () => {
      it('should be a function', () => {
        expect(instance.create).toBeInstanceOf(Function);
      });

      it('should create a request and add it to the list of requests', () => {
        const mockConfig = {};
        const mockResolve = jest.fn();
        const mockDoRequest = jest.fn();
        instance.create('url', mockConfig, mockResolve, mockDoRequest);
        expect(instance.requests.length).toEqual(1);
        const req = instance.requests[0];
        expect(req).toBeInstanceOf(Request);
        expect(req.url).toEqual('url');
        expect(req.config).toBe(mockConfig);
        expect(req.resolve).toBe(mockResolve);
        expect(req.doRequest).toBe(mockDoRequest);
      });
    });

    describe('getAll', () => {
      it('should be a function', () => {
        expect(instance.getAll).toBeInstanceOf(Function);
      });

      it('should empty the list of requests and return all items that were in the list', () => {
        instance.create('a');
        instance.create('b');
        instance.create('c');
        expect(instance.getAll()).toMatchObject([{ url: 'a' }, { url: 'b' }, { url: 'c' }]);
        expect(instance.requests.length).toEqual(0);
      });
    });

    describe('getNext', () => {
      it('should be a function', () => {
        expect(instance.getNext).toBeInstanceOf(Function);
      });

      it('should return the first request in the list and remove that item from the list of requests', () => {
        instance.create('a');
        instance.create('b');
        instance.create('c');
        expect(instance.getNext()).toMatchObject({ url: 'a' });
        expect(instance.requests.length).toEqual(2);
        expect(instance.getNext()).toMatchObject({ url: 'b' });
        expect(instance.requests.length).toEqual(1);
        expect(instance.getNext()).toMatchObject({ url: 'c' });
        expect(instance.requests.length).toEqual(0);
      });
    });
  });
});

describe('FetchScope', () => {
  it('should be a class', () => {
    expect(FetchScope).toBeAClass();
  });


  it('should extends DigestibleScope', () => {
    expect(FetchScope).toExtend(DigestibleScope);
  });

  describe('instance', () => {
    let instance;

    beforeEach(() => {
      instance = new FetchScope({});
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
      expect(instance.doRequest).toBeInstanceOf(Function);
      expect(instance.doRequest()).toBeUndefined();
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

    describe('createRequest', () => {
      it('should be a function', () => {
        expect(instance.createRequest).toBeInstanceOf(Function);
      });

      it('should set global.fetch to a bound requests.requests.create', () => {
        const mockConfig = {};
        const mockFn = jest.fn();
        instance.requests.create = (url, config, resolve, doRequest) => mockFn(url, config, resolve, doRequest);
        instance.createRequest('url', mockConfig);
        expect(mockFn).toHaveBeenCalledTimes(1);
        expect(mockFn.mock.calls[0][0]).toEqual('url');
        expect(mockFn.mock.calls[0][1]).toEqual(mockConfig);
        expect(mockFn.mock.calls[0][2]).toBeInstanceOf(Function);
        expect(mockFn.mock.calls[0][3]).toBe(instance.doRequest);
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
        expect(global.fetch).toBeUndefined();
      });
    });
  });
});
