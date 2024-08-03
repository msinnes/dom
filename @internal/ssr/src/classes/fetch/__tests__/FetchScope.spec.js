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

    afterEach(() => {
      instance.disable();
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

      it('should return a promise', () => {
        instance.doRequest = jest.fn();
        instance.doRequest.mockImplementation((req, res) => {
          expect(req.url).toEqual('url');
          expect(req.config.method).toEqual('POST');
          res.text('text');
          res.close();
        });
        const promise = instance.createRequest('url', { method: 'POST' });
        promise.then(response => response.text().then(data => expect(data).toEqual('text')));
        instance.requests.requests[0].exec();
      });

      it('should trigger the scope when the promise resolves', () => {
        const triggerSpy = jest.spyOn(instance, 'trigger');
        const mockConfig = {};
        instance.createRequest('url', mockConfig);

        expect(instance.openRequests).toEqual(1);
        instance.requests.requests[0].exec();
        expect(instance.openRequests).toEqual(0);
        expect(triggerSpy).toHaveBeenCalledTimes(1);
        expect(triggerSpy).toHaveBeenCalledWith('resolve');
      });

      it('should ignore the promise if the scope is closed', () => {
        const triggerSpy = jest.spyOn(instance, 'trigger');
        const mockConfig = {};
        instance.createRequest('url', mockConfig);

        instance.close();
        instance.requests.requests[0].exec();
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
        instance.enable();
        expect(fetch).toBeDefined();
        expect(fetch).toBeInstanceOf(Function);
        fetch('url', mockConfig);
        expect(instance.requests.requests.length).toEqual(1);
        instance.disable();
      });

      it('fetch should return a promise', () => {
        instance.doRequest = jest.fn();
        instance.doRequest.mockImplementation((req, res) => {
          expect(req.url).toEqual('url');
          res.text('text');
          res.close();
        });
        instance.enable();
        const promise = fetch('url');
        promise.then(response => response.text().then(data => expect(data).toEqual('text')));
        expect(promise).toBeInstanceOf(SyncPromise);
        expect(instance.requests.requests[0].exec).toBeInstanceOf(Function);
        instance.requests.requests[0].exec();
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
