import { FetchResponse } from '../FetchResponse';

describe('FetchResponse', () => {
  it('should be a class', () => {
    expect(FetchResponse).toBeAClass();
  });

  describe('instance', () => {
    let value;

    let instance;
    beforeEach(() => {
      instance = new FetchResponse(val => {
        value = val;
      });
    });

    it('should have a hasSet prop set to false', () => {
      expect(instance.hasSet).toEqual(false);
    });

    describe('json', () => {
      it('should be a function', () => {
        expect(instance.json).toBeInstanceOf(Function);
      });

      it('should call the setter to set the value', () => {
        const mockData = {};
        instance.json(mockData);
        expect(value).toBe(mockData);
      });

      it('should throw an error if the data is already set', () => {
        const data1 = { data: 'data1' };
        const data2 = { data: 'data2' };
        expect(() => {
          instance.json(data1);
        }).not.toThrow();

        expect(() => {
          instance.json(data2);
        }).toThrow('ImplementationError: Data can only be set once on a response.');
      });
    });

    describe('text', () => {
      it('should be a function', () => {
        expect(instance.text).toBeInstanceOf(Function);
      });

      it('should call the setter to set the value', () => {
        const mockData = 'text';
        instance.text(mockData);
        expect(value).toBe(mockData);
      });

      it('should throw an error if the data is already set', () => {
        const data1 = 'data1';
        const data2 = 'data2';
        expect(() => {
          instance.text(data1);
        }).not.toThrow();

        expect(() => {
          instance.text(data2);
        }).toThrow('ImplementationError: Data can only be set once on a response.');
      });
    });
  });
});
