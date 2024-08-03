import { FetchResponse } from '../FetchResponse';

describe('FetchResponse', () => {
  it('should be a class', () => {
    expect(FetchResponse).toBeAClass();
  });

  describe('instance', () => {
    let mockContext;

    let instance;

    beforeEach(() => {
      mockContext = {
        isDataSet: false,
        close: jest.fn(),
        error: jest.fn(),
        getData: jest.fn(),
        setData: jest.fn(),
      };
      instance = new FetchResponse(mockContext);
    });

    describe('close', () => {
      it('should be a function', () => {
        expect(instance.close).toBeInstanceOf(Function);
      });

      it('should call the close mock on the given context', () => {
        instance.close();
        expect(mockContext.close).toHaveBeenCalledTimes(1);
      });
    });

    describe('json', () => {
      it('should be a function', () => {
        expect(instance.json).toBeInstanceOf(Function);
      });

      it('should call the setter to set the value', () => {
        const mockData = {};
        instance.json(mockData);
        expect(mockContext.setData).toHaveBeenCalledTimes(1);
        expect(mockContext.setData).toHaveBeenCalledWith(mockData);
      });

      it('should throw an error if the data is already set', () => {
        expect(() => {
          instance.json({});
        }).not.toThrow();
        mockContext.isDataSet = true;
        expect(() => {
          instance.json({});
        }).toThrow('ImplementationError: Data can only be set once on a response.');
      });
    });

    describe('text', () => {
      it('should be a function', () => {
        expect(instance.text).toBeInstanceOf(Function);
      });

      it('should call the setter to set the value', () => {
        const mockData = {};
        instance.text(mockData);
        expect(mockContext.setData).toHaveBeenCalledTimes(1);
        expect(mockContext.setData).toHaveBeenCalledWith(mockData);
      });

      it('should throw an error if the data is already set', () => {
        expect(() => {
          instance.text('data');
        }).not.toThrow();
        mockContext.isDataSet = true;
        expect(() => {
          instance.text('data');
        }).toThrow('ImplementationError: Data can only be set once on a response.');
      });
    });
  });
});
