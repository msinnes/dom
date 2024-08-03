import { FetchResponse } from '../../response/FetchResponse';
import { FetchRequest } from '../FetchRequest';

import { Request } from '../Request';

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
