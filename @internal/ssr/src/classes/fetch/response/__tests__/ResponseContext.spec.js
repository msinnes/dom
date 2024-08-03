import { ResponseContext } from '../ResponseContext';

describe('ResponseContext', () => {
  it('should be a class', () => {
    expect(ResponseContext).toBeAClass();
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
      instance = new ResponseContext(doRequestMock, resolveMock, rejectMock);
    });

    it('should have an isDataSet prop set to false', () => {
      expect(instance.isDataSet).toBe(false);
    });

    describe('ok', () => {
      it('should return false by default', () => {
        expect(instance.ok).toBe(false);
      });

      it('should return true if the data has been set', () => {
        instance.setData('data');
        expect(instance.ok).toBe(true);
      });
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
