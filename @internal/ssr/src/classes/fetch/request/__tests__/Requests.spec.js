import { Request } from '../Request';

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
        const mockContext = {};
        instance.create('url', mockConfig, mockContext);
        expect(instance.requests.length).toEqual(1);
        const req = instance.requests[0];
        expect(req).toBeInstanceOf(Request);
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
        expect(instance.getAll().map(item => item.fetchRequest)).toMatchObject([{ url: 'a' }, { url: 'b' }, { url: 'c' }]);
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
        expect(instance.getNext().fetchRequest).toMatchObject({ url: 'a' });
        expect(instance.requests.length).toEqual(2);
        expect(instance.getNext().fetchRequest).toMatchObject({ url: 'b' });
        expect(instance.requests.length).toEqual(1);
        expect(instance.getNext().fetchRequest).toMatchObject({ url: 'c' });
        expect(instance.requests.length).toEqual(0);
      });
    });
  });
});
