import { BaseService } from '../../base/BaseService';

import { AppContext } from '../AppContext';
import { UserContext } from '../UserContext';

import { ContextService } from '../ContextService';

describe('ContextService', () => {
  it('should be a class', () => {
    expect(ContextService).toBeAClass();
  });

  it('should extend BaseService', () => {
    expect(ContextService).toExtend(BaseService);
  });

  describe('instance', () => {
    let instance;
    beforeEach(() => {
      instance = new ContextService();
    });

    it('should have a providers array', () => {
      expect(instance.providers).toBeInstanceOf(Array);
      expect(instance.providers.length).toEqual(0);
    });

    describe('createEntity', () => {
      it('should be a function', () => {
        expect(instance.createEntity).toBeInstanceOf(Function);
      });

      it('should create a context and assign an instance and provider lookup', () => {
        const userContext = instance.createEntity('default value');
        expect(userContext).toBeInstanceOf(UserContext);
        expect(instance.indexes.length).toEqual(1);
        expect(instance.indexes[0]).toBe(userContext);
        expect(instance.entities.length).toEqual(1);
        expect(instance.entities[0]).toBeInstanceOf(AppContext);
        expect(instance.entities[0].userContext).toBe(userContext);
        expect(instance.entities[0].value).toEqual('default value');
        expect(instance.providers.length).toEqual(1);
        expect(instance.providers[0]).toBe(userContext.Provider);
      });
    });

    describe('getContextValue', () => {
      it('should be a function', () => {
        expect(instance.getContextValue).toBeInstanceOf(Function);
      });

      it('should get the value for a given context instance', () => {
        const userContext1 = instance.createEntity('value 1');
        const userContext2 = instance.createEntity('value 2');

        expect(instance.getContextValue(userContext1)).toEqual('value 1');
        expect(instance.getContextValue(userContext2)).toEqual('value 2');
      });

      it('should provide a warning and return undefined if no context is found', () => {
        const consoleWarnMock = jest.fn();
        const consoleWarnOriginal = console.warn;
        console.warn = consoleWarnMock;

        expect(instance.getContextValue({})).toBeUndefined();
        expect(consoleWarnMock).toHaveBeenCalledTimes(1);
        expect(consoleWarnMock).toHaveBeenCalledWith('ImplementationWarning: The input context was not found, returning undefined.');

        console.warn = consoleWarnOriginal;
      });
    });

    describe('clearContextValue', () => {
      it('should be a function', () => {
        expect(instance.clearContextValue).toBeInstanceOf(Function);
      });

      it('should take a provider and call removeValue for that provider\'s context', () => {
        const userContext = instance.createEntity('value');
        const providerProps = { value: 'provided value', children: [] };
        userContext.Provider(providerProps);

        expect(instance.getContextValue(userContext)).toEqual('provided value');
        instance.clearContextValue(userContext.Provider);
        expect(instance.getContextValue(userContext)).toEqual('value');
      });

      it('should do nothing if the provider is not found', () => {
        const userContext = instance.createEntity('value');
        const providerProps = { value: 'provided value', children: [] };
        userContext.Provider(providerProps);

        expect(instance.getContextValue(userContext)).toEqual('provided value');
        instance.clearContextValue({});
        expect(instance.getContextValue(userContext)).toEqual('provided value');
      });
    });
  });
});
