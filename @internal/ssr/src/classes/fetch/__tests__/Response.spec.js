import { CompositeResponse, FetchResponse, Response } from '../Response';

describe('CompositeResponse', () => {
  it('should be a class', () => {
    expect(CompositeResponse).toBeAClass();
  });

  describe('instance', () => {
    let instance;

    beforeEach(() => {
      instance = new CompositeResponse();
    });

    it('should have a fetch prop', () => {
      expect(instance.fetch).toBeInstanceOf(FetchResponse);
    });

    it('should have a response prop', () => {
      expect(instance.response).toBeInstanceOf(Response);
    });

    describe('json', () => {
      it('should be a function', () => {
        expect(instance.json).toBeUndefined();
        expect(instance.fetch.json).toBeInstanceOf(Function);
        expect(instance.response.json).toBeInstanceOf(Function);
      });

      it('should set data', () => {
        const data = { data: 'data' };
        instance.fetch.json(data);
        expect(instance.data).toBeUndefined();
        instance.response.json().then(output => {
          expect(output).toMatchObject(data);
        });
      });

      it('should throw an error if data is already set', () => {
        const data1 = { data: 'data1' };
        const data2 = { data: 'data2' };
        expect(() => {
          instance.fetch.json(data1);
        }).not.toThrow();

        expect(() => {
          instance.fetch.json(data2);
        }).toThrow('ImplementationError: Data can only be set once on a response.');
      });
    });

    describe('text', () => {
      it('should be a function', () => {
        expect(instance.text).toBeUndefined();
        expect(instance.fetch.text).toBeInstanceOf(Function);
        expect(instance.response.text).toBeInstanceOf(Function);
      });

      it('should set data', () => {
        const data = { data: 'data' };
        instance.fetch.text(data);
        expect(instance.data).toBeUndefined();
        instance.response.text().then(output => {
          expect(output).toMatchObject(data);
        });
        // instance.resolve();
      });

      it('should throw an error if data is already set', () => {
        const data1 = { data: 'data1' };
        const data2 = { data: 'data2' };
        expect(() => {
          instance.fetch.text(data1);
        }).not.toThrow();

        expect(() => {
          instance.fetch.text(data2);
        }).toThrow('ImplementationError: Data can only be set once on a response.');
      });
    });
  });
});

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

    describe('text', () => {

    });
  });
});
