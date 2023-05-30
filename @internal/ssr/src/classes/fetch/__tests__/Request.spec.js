import { Request, Requests } from '../Request';
import { FetchResponse, Response } from '../Response';

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
