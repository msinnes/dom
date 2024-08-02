import { Response } from '../Response';

describe('Response', () => {
  it('should be a class', () => {
    expect(Response).toBeAClass();
  });

  describe('instance', () => {
    let value;

    let instance;
    beforeEach(() => {
      instance = new Response(() => {
        return value;
      });
    });

    describe('json', () => {
      it('should be a function', () => {
        expect(instance.json).toBeInstanceOf(Function);
      });

      it('should return the data in the value slot wrapped in a promise', () => {
        const mockData = {};
        value = mockData;
        instance.json().then(data => expect(data).toBe(mockData));
      });
    });

    describe('text', () => {
      it('should be a function', () => {
        expect(instance.text).toBeInstanceOf(Function);
      });

      it('should return the data in the value slot wrapped in a promise', () => {
        const mockData = 'data';
        value = mockData;
        instance.text().then(data => expect(data).toBe(mockData));
      });
    });
  });
});
