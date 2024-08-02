import { Request } from '../Request';
import { Request as NewRequest } from '../NewRequest';

import { Requests } from '../Requests';

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

    describe('newCreate', () => {
      it('should be a function', () => {
        expect(instance.newCreate).toBeInstanceOf(Function);
      });

      it('should create a request and add it to the list of requests', () => {
        const mockConfig = {};
        const mockContext = {};
        instance.newCreate('url', mockConfig, mockContext);
        expect(instance.requests.length).toEqual(1);
        const req = instance.requests[0];
        expect(req).toBeInstanceOf(NewRequest);
        expect(req.fetchRequest.url).toEqual('url');
        expect(req.fetchRequest.config).toBe(mockConfig);
        expect(req.ctx).toBe(mockContext);
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
