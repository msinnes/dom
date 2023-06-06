import { FetchResponse } from '../../response/FetchResponse';
import { Response } from '../../response/Response';

import { Request } from '../Request';

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
      mockDoRequest = jest.fn().mockImplementation((req, res) => {
        res.text('text');
        res.close();
      });
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

    it('should set the doRequest prop', () => {
      expect(instance.doRequest).toBe(mockDoRequest);
    });

    it('should set the resolve prop', () => {
      expect(instance.resolve).toBe(mockResolve);
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
