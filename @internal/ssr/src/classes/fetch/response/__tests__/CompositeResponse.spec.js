import { FetchResponse } from '../FetchResponse';
import { Response } from '../Response';

import { CompositeResponse } from '../CompositeResponse';

describe('CompositeResponse', () => {
  it('should be a class', () => {
    expect(CompositeResponse).toBeAClass();
  });

  describe('instance', () => {
    let doRequestMock;
    let resolveMock;

    let instance;

    beforeEach(() => {
      doRequestMock = jest.fn();
      resolveMock = jest.fn();

      instance = new CompositeResponse(doRequestMock, resolveMock);
    });

    describe('executeRequest', () => {
      it('should be a function', () => {
        expect(instance.executeRequest).toBeInstanceOf(Function);
      });

      it('should call the doRequestMock', () => {
        const mockRequest = {};
        instance.executeRequest(mockRequest);
        expect(doRequestMock).toHaveBeenCalledTimes(1);
        expect(doRequestMock.mock.calls[0][0]).toBe(mockRequest);
        const fetchResponse = doRequestMock.mock.calls[0][1];
        expect(fetchResponse).toBeInstanceOf(FetchResponse);
        expect(fetchResponse.close).toBeInstanceOf(Function);
        fetchResponse.text('text');
        fetchResponse.close();
        expect(resolveMock).toHaveBeenCalledTimes(1);
        const response = resolveMock.mock.calls[0][0];
        expect(response).toBeInstanceOf(Response);
        response.text().then(data => expect(data).toEqual('text'));
      });
    });
  });
});
