import { Request, FetchRequest, FetchResponse, RequestContext, Response } from '../NewRequest';

describe('RequestContext', () => {
  it('should be a class', () => {
    expect(RequestContext).toBeAClass();
  });

  describe('instance', () => {
    let doRequestMock;
    let resolveMock;
    let rejectMock;

    let instance;
    beforeEach(() => {
      doRequestMock = jest.fn();
      resolveMock = jest.fn();
      rejectMock = jest.fn();
      instance = new RequestContext(doRequestMock, resolveMock, rejectMock);
    });

    it('should have an isDataSet prop set to false', () => {
      expect(instance.isDataSet).toBe(false);
    });

    describe('close', () => {
      it('should be a function', () => {
        expect(instance.close).toBeInstanceOf(Function);
      });

      it('should call the resolveMock with the given responseRef', () => {
        let dataRef = {};
        instance.setData(dataRef);
        instance.close();
        expect(resolveMock).toHaveBeenCalledTimes(1);
        expect(resolveMock).toHaveBeenCalledWith(instance);
      });
    });

    describe('error', () => {
      it('should be a function', () => {
        expect(instance.error).toBeInstanceOf(Function);
      });

      it('should call the rejectMock with the given errorRef', () => {
        let errorRef = {};
        instance.error(errorRef);
        expect(rejectMock).toHaveBeenCalledTimes(1);
        expect(rejectMock).toHaveBeenCalledWith(errorRef);
      });
    });

    describe('executeRequest', () => {
      it('should be a function', () => {
        expect(instance.executeRequest).toBeInstanceOf(Function);
      });

      it('should call the doRequestMock passed to the instance constructor with the given request and response', () => {
        const reqRef = {};
        const resRef = {};
        instance.executeRequest(reqRef, resRef);
        expect(doRequestMock).toHaveBeenCalledTimes(1);
        expect(doRequestMock).toHaveBeenCalledWith(reqRef, resRef);
      });
    });

    describe('getData', () => {
      it('should be a function', () => {
        expect(instance.getData).toBeInstanceOf(Function);
      });

      it('should return undefined if the data is not set first', () => {
        instance.getData();
        expect(instance.getData()).toBeUndefined();
      });
    });

    describe('setData', () => {
      it('should be a function', () => {
        expect(instance.setData).toBeInstanceOf(Function);
      });

      it('should toggle the isDataSet method', () => {
        instance.setData('data');
        expect(instance.isDataSet).toBe(true);
      });

      it('should give a value for `getData` to return', () => {
        instance.setData('data');
        expect(instance.getData()).toEqual('data');
      });
    });
  });
});

describe('FetchRequest', () => {
  it('should be a class', () => {
    expect(FetchRequest).toBeAClass();
  });

  describe('instance', () => {
    let instance;
    let configRef;

    beforeEach(() => {
      configRef = {};
      instance = new FetchRequest('url', configRef);
    });

    it('should have a url prop', () => {
      expect(instance.url).toEqual('url');
    });

    it('should have a config prop', () => {
      expect(instance.config).toBeDefined();
      expect(instance.config).toBe(configRef);
    });
  });
});

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

describe('Request', () => {
  it('should be a class', () => {
    expect(Request).toBeAClass();
  });

  describe('instance', () => {
    let instance;
    let configRef;
    let contextRef;

    beforeEach(() => {
      configRef = {};
      contextRef = {};
      instance = new Request('url', configRef, contextRef);
    });

    it('should have a fetchRequest prop', () => {
      expect(instance.fetchRequest).toBeDefined();
      expect(instance.fetchRequest).toBeInstanceOf(FetchRequest);
      expect(instance.fetchRequest.url).toEqual('url');
      expect(instance.fetchRequest.config).toBeDefined();
      expect(instance.fetchRequest.config).toBe(configRef);
    });

    it('should have a fetchResponse prop', () => {
      expect(instance.fetchResponse).toBeDefined();
      expect(instance.fetchResponse).toBeInstanceOf(FetchResponse);
    });

    it('shold have a ctx prop', () => {
      expect(instance.ctx).toBe(contextRef);
    });

    describe('exec', () => {
      it('should be a function', () => {
        expect(instance.exec).toBeInstanceOf(Function);
      });

      it('should call the ctx.executeRequest mock with the fetchRequest and fetchResponse', () => {
        contextRef.executeRequest = jest.fn();
        instance.exec();
        expect(contextRef.executeRequest).toHaveBeenCalledTimes(1);
        expect(contextRef.executeRequest).toHaveBeenCalledWith(instance.fetchRequest, instance.fetchResponse);
      });
    });
  });
});

describe('Response', () => {
  it('should be a class', () => {
    expect(Response).toBeAClass();
  });

  describe('instance', () => {
    let mockContext;

    let instance;
    beforeEach(() => {
      mockContext = {
        getData: jest.fn(),
      };

      instance = new Response(mockContext);
    });

    describe('json', () => {
      it('should be a function', () => {
        expect(instance.json).toBeInstanceOf(Function);
      });

      it('should return the data in the value slot wrapped in a promise', () => {
        const mockData = {};
        mockContext.getData.mockReturnValue(mockData);
        instance.json().then(data => expect(data).toBe(mockData));
      });
    });

    describe('text', () => {
      it('should be a function', () => {
        expect(instance.text).toBeInstanceOf(Function);
      });

      it('should return the data in the value slot wrapped in a promise', () => {
        const mockData = 'data';
        mockContext.getData.mockReturnValue(mockData);
        instance.text().then(data => expect(data).toBe(mockData));
      });
    });
  });
});
