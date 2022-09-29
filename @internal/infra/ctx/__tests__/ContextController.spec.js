import { BaseController } from '../../base/BaseController';

import { Context } from '../Context';
import { ContextContext } from '../ContextContext';

import { ContextController } from '../ContextController';

describe('ContextController', () => {
  it('should be a class', () => {
    expect(ContextController).toBeAClass();
  });

  it('should extend BaseController', () => {
    expect(ContextController).toExtend(BaseController);
  });

  describe('instance', () => {
    let instance;
    beforeEach(() => {
      instance = new ContextController();
    });

    it('should have a instances array', () => {
      expect(instance.instances).toBeInstanceOf(Array);
      expect(instance.instances.length).toEqual(0);
    });

    it('should have a contexts array', () => {
      expect(instance.contexts).toBeInstanceOf(Array);
      expect(instance.contexts.length).toEqual(0);
    });

    it('should have a providers array', () => {
      expect(instance.providers).toBeInstanceOf(Array);
      expect(instance.providers.length).toEqual(0);
    });

    describe('createContext', () => {
      it('should be a function', () => {
        expect(instance.createContext).toBeInstanceOf(Function);
      });

      it('should create a context and assign an instance and provider lookup', () => {
        const ctx = instance.createContext('default value');
        expect(ctx).toBeInstanceOf(Context);
        expect(instance.instances.length).toEqual(1);
        expect(instance.instances[0]).toBe(ctx);
        expect(instance.contexts.length).toEqual(1);
        expect(instance.contexts[0]).toBeInstanceOf(ContextContext);
        expect(instance.contexts[0].ctx).toBe(ctx);
        expect(instance.contexts[0].value).toEqual('default value');
        expect(instance.providers.length).toEqual(1);
        expect(instance.providers[0]).toBe(ctx.Provider);
      });
    });

    describe('getContextValue', () => {
      it('should be a function', () => {
        expect(instance.getContextValue).toBeInstanceOf(Function);
      });

      it('should get the value for a given context instance', () => {
        const ctx1 = instance.createContext('value 1');
        const ctx2 = instance.createContext('value 2');

        expect(instance.getContextValue(ctx1)).toEqual('value 1');
        expect(instance.getContextValue(ctx2)).toEqual('value 2');
      });

      it('should provide a warning and return undefined if no context is found', () => {
        const consoleWarnMock = jest.fn();
        const consoleWarnOriginal = console.warn;
        console.warn = consoleWarnMock;

        const ctx1 = instance.createContext('value 1');
        const ctx2 = instance.createContext('value 2');

        expect(instance.getContextValue({})).toBeUndefined();
        expect(consoleWarnMock).toHaveBeenCalledTimes(1);
        expect(consoleWarnMock).toHaveBeenCalledWith('ImplementationWarning: The input context was not found, returning undefined.');

        console.warn = console.consoleWarnOriginal;
      });
    });

    describe('clearContextValue', () => {
      it('should be a function', () => {
        expect(instance.clearContextValue).toBeInstanceOf(Function);
      });

      it('should take a provider and call removeValue for that provider\'s context', () => {
        const ctx = instance.createContext('value');
        const providerProps = { value: 'provided value', children: [] };
        ctx.Provider(providerProps);

        expect(instance.getContextValue(ctx)).toEqual('provided value');
        instance.clearContextValue(ctx.Provider);
        expect(instance.getContextValue(ctx)).toEqual('value');
      });

      it('should do nothing if the provider is not found', () => {
        const ctx = instance.createContext('value');
        const providerProps = { value: 'provided value', children: [] };
        ctx.Provider(providerProps);

        expect(instance.getContextValue(ctx)).toEqual('provided value');
        instance.clearContextValue({});
        expect(instance.getContextValue(ctx)).toEqual('provided value');
      });
    });
  });
});