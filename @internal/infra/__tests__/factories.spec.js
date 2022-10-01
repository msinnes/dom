/**
 * @jest-environment jsdom
 */
import { DomRef } from '@internal/dom/DomRef';

import { ContextController } from '../ctx/ContextController';
import { EffectController } from '../effect/EffectController';
import * as factories from '../factories';
import { HookController } from '../hooks/HookController';

describe('factories.createServices', () => {
  it('should be a function', () => {
    expect(factories.createServices).toBeInstanceOf(Function);
  });

  describe('factory output', () => {
    let mockContextController;
    let mockEffectController;
    let mockHookController;
    let svc;
    beforeEach(() => {
      mockContextController = {
        clearContextValue: jest.fn(),
        getContextValue: jest.fn(),
        createContext: jest.fn(),
      };
      mockEffectController = {
        addEffect: jest.fn(),
        createContext: jest.fn(),
        destroyContext: jest.fn(),
        digest: jest.fn(),
      };
      mockHookController = {
        createContext: jest.fn(),
        destroyContext: jest.fn(),
        closeActiveContext: jest.fn(),
        setActiveContext: jest.fn(),
      };
      svc = factories.createServices(mockContextController, mockEffectController, mockHookController);
    });

    it('should return an object', () => {
      expect(svc).toBeDefined();
      expect(svc).toBeInstanceOf(Object);
    });

    describe('effectController', () => {
      describe('addEffect', () => {
        it('should be a function', () => {
          expect(svc.addEffect).toBeInstanceOf(Function);
        });

        it('should call effectController.addEffect', () => {
          const ref = {};
          const effectRef = {};
          svc.addEffect(ref, effectRef);
          expect(mockEffectController.addEffect).toHaveBeenCalledTimes(1);
          expect(mockEffectController.addEffect).toHaveBeenCalledWith(ref, effectRef);
        });
      });

      describe('createEffectContext', () => {
        it('should be a function', () => {
          expect(svc.createEffectContext).toBeInstanceOf(Function);
        });

        it('should call effectController.createContext', () => {
          const ref = {};
          svc.createEffectContext(ref);
          expect(mockEffectController.createContext).toHaveBeenCalledTimes(1);
          expect(mockEffectController.createContext).toHaveBeenCalledWith(ref);
        });
      });

      describe('destroyEffectContext', () => {
        it('should be a function', () => {
          expect(svc.destroyEffectContext).toBeInstanceOf(Function);
        });

        it('should call effectController.destroyContext', () => {
          const ref = {};
          svc.destroyEffectContext(ref);
          expect(mockEffectController.destroyContext).toHaveBeenCalledTimes(1);
          expect(mockEffectController.destroyContext).toHaveBeenCalledWith(ref);
        });
      });

      describe('digestEffects', () => {
        it('should be a function', () => {
          expect(svc.digestEffects).toBeInstanceOf(Function);
        });

        it('should call effectController.digest', () => {
          const ref = {};
          svc.digestEffects(ref);
          expect(mockEffectController.digest).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe('contextController', () => {
      describe('clearContextValue', () => {
        it('should be a function', () => {
          expect(svc.clearContextValue).toBeInstanceOf(Function);
        });

        it('should call contextController.clearContextValue', () => {
          const ref = {};
          svc.clearContextValue(ref);
          expect(mockContextController.clearContextValue).toHaveBeenCalledTimes(1);
          expect(mockContextController.clearContextValue).toHaveBeenCalledWith(ref, );
        });
      });

      describe('getContextValue', () => {
        it('should be a function', () => {
          expect(svc.getContextValue).toBeInstanceOf(Function);
        });

        it('should call contextController.getContextValue', () => {
          const ref = {};
          svc.getContextValue(ref);
          expect(mockContextController.getContextValue).toHaveBeenCalledTimes(1);
          expect(mockContextController.getContextValue).toHaveBeenCalledWith(ref);
        });
      });

      describe('createApiContext', () => {
        it('should be a function', () => {
          expect(svc.createApiContext).toBeInstanceOf(Function);
        });

        it('should call contextController.createContext', () => {
          const ref = {};
          svc.createApiContext(ref);
          expect(mockContextController.createContext).toHaveBeenCalledTimes(1);
          expect(mockContextController.createContext).toHaveBeenCalledWith(ref);
        });
      });
    });

    describe('hookController', () => {
      describe('createHookContext', () => {
        it('should be a function', () => {
          expect(svc.createHookContext).toBeInstanceOf(Function);
        });

        it('should call hookController.createContext', () => {
          const ref = {};
          svc.createHookContext(ref);
          expect(mockHookController.createContext).toHaveBeenCalledTimes(1);
          expect(mockHookController.createContext).toHaveBeenCalledWith(ref);
        });
      });

      describe('destroyHookContext', () => {
        it('should be a function', () => {
          expect(svc.destroyHookContext).toBeInstanceOf(Function);
        });

        it('should call hookController.destroyContext', () => {
          const ref = {};
          svc.destroyHookContext(ref);
          expect(mockHookController.destroyContext).toHaveBeenCalledTimes(1);
          expect(mockHookController.destroyContext).toHaveBeenCalledWith(ref);
        });
      });

      describe('closeActiveHookContext', () => {
        it('should be a function', () => {
          expect(svc.closeActiveHookContext).toBeInstanceOf(Function);
        });

        it('should call hookController.closeActiveContext', () => {
          const ref = {};
          svc.closeActiveHookContext(ref);
          expect(mockHookController.closeActiveContext).toHaveBeenCalledTimes(1);
        });
      });

      describe('setActiveHookContext', () => {
        it('should be a function', () => {
          expect(svc.setActiveHookContext).toBeInstanceOf(Function);
        });

        it('should call hookController.setActiveContext', () => {
          const ref = {};
          svc.setActiveHookContext(ref);
          expect(mockHookController.setActiveContext).toHaveBeenCalledTimes(1);
          expect(mockHookController.setActiveContext).toHaveBeenCalledWith(ref);
        });
      });
    });
  });
});

describe('factories.createHooks', () => {
  let hookController;
  let effectController;
  let contextController;
  let useState;
  let useContext;
  let useMemo;
  let useEffect;
  let useRef;
  beforeEach(() => {
    hookController = {};
    effectController = {};
    contextController = {};
    const {
      useState: useStateHook,
      useContext: useContextHook,
      useMemo: useMemoHook,
      useEffect: useEffectHook,
      useRef: useRefHook,
    } = factories.createHooks(contextController, effectController, hookController);
    useState = useStateHook;
    useContext = useContextHook;
    useMemo = useMemoHook;
    useEffect = useEffectHook;
    useRef = useRefHook;
  });

  it('should be a function', () => {
    expect(factories.createHooks).toBeInstanceOf(Function);
  });

  describe('useState', () => {
    let getHookMock;
    beforeEach(() => {
      getHookMock = jest.fn();
      hookController.getHook = getHookMock;
    });

    afterEach(() => {
      jest.resetAllMocks();
      jest.resetModules();
    });

    it('should be a function', () => {
      expect(useState).toBeInstanceOf(Function);
    });

    it('should call the hookController.getHook and pass the initialState', () => {
      const setStateMock = jest.fn();
      const hookGetRef = {};
      const hookGetMock = jest.fn();
      const hookSetMock = jest.fn();
      hookGetMock.mockImplementation(() => hookGetRef);
      const getHookReturnRef = {
        get: hookGetMock,
        set: hookSetMock,
        component: {
          setState: setStateMock,
        },
      };
      getHookMock.mockImplementation(() => getHookReturnRef);
      const [state, setState] = useState('initialValue');
      expect(getHookMock).toHaveBeenCalledTimes(1);
      expect(getHookMock).toHaveBeenCalledWith('initialValue');
      expect(hookGetMock).toHaveBeenCalledTimes(1);
      expect(state).toBe(hookGetRef);
      expect(setState).toBeInstanceOf(Function);
      setState('someNewValue');
      expect(hookSetMock).toHaveBeenCalledTimes(1);
      expect(hookSetMock).toHaveBeenCalledWith('someNewValue');
      expect(setStateMock).toHaveBeenCalledTimes(1);
    });

    it('should call hookController.setStateAsync when setState is called', () => {
      const setStateMock = jest.fn();
      const hookGetRef = {};
      const hookComponentInstance = { setState: setStateMock };
      const hookGetMock = jest.fn();
      const hookSetMock = jest.fn();
      hookGetMock.mockImplementation(() => hookGetRef);
      const getHookReturnRef = {
        get: hookGetMock,
        set: hookSetMock,
        component: hookComponentInstance,
      };
      getHookMock.mockImplementation(() => getHookReturnRef);
      const [state, setState] = useState('initialValue');
      expect(getHookMock).toHaveBeenCalledTimes(1);
      expect(getHookMock).toHaveBeenCalledWith('initialValue');
      expect(hookGetMock).toHaveBeenCalledTimes(1);
      expect(state).toBe(hookGetRef);
      expect(setState).toBeInstanceOf(Function);
      setState('someNewValue');
      expect(hookSetMock).toHaveBeenCalledTimes(1);
      expect(hookSetMock).toHaveBeenCalledWith('someNewValue');
      expect(setStateMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('useMemo', () => {
    let getHookMock;
    beforeEach(() => {
      getHookMock = jest.fn();
      hookController.getHook = getHookMock;
    });

    afterEach(() => {
      jest.resetAllMocks();
      jest.resetModules();
    });

    it('should be a function', () => {
      expect(useMemo).toBeInstanceOf(Function);
    });

    it('should throw an error if incorrect arguments are passed', () => {
      const getHookReturnRef = {
        get: () => {},
        set: () => {},
      };
      getHookMock.mockImplementation(() => getHookReturnRef);
      const fn = () => {};
      const arr = [];

      expect(() => {
        useMemo(fn);
        useMemo(fn, arr);
      }).not.toThrow();

      expect(() => {
        useMemo(fn, 'not an array');
        useMemo('not a function');
      }).toThrow('ValidationError');
    });

    it('should not pass an initial value to the getHookMock', () => {
      const getHookReturnRef = {
        get: () => {},
        set: () => {},
      };
      getHookMock.mockImplementation(() => getHookReturnRef);
      const fn = () => {};
      useMemo(fn);
      expect(getHookMock).toHaveBeenCalledTimes(1);
      expect(getHookMock.mock.calls[0].length).toBe(0);
    });

    it('should execute the fnMock if there is nothing set on the hook', () => {
      const hookGetRef = {};
      const hookGetMock = jest.fn();
      const hookSetMock = jest.fn();
      hookGetMock.mockImplementation(() => hookGetRef);
      const getHookReturnRef = {
        get: hookGetMock,
        set: hookSetMock,
      };
      getHookMock.mockImplementation(() => getHookReturnRef);
      hookGetMock.mockImplementation(() => undefined);

      const fnMock = jest.fn();
      const fn = () => fnMock();
      const memoRef = {};
      fnMock.mockImplementation(() => memoRef);

      const memo = useMemo(fn);

      expect(getHookMock).toHaveBeenCalledTimes(1);
      expect(getHookMock.mock.calls[0].length).toBe(0);

      expect(fnMock).toHaveBeenCalledTimes(1);
      expect(hookGetMock).toHaveBeenCalledTimes(1);
      expect(hookSetMock).toHaveBeenCalledTimes(1);
      expect(hookSetMock.mock.calls[0][0]).toMatchObject({ value: memoRef });
      expect(memo).toBe(memoRef);
    });

    it('should not call the fnMock if the hook value is defined', () => {
      const hookGetRef = {};
      const hookGetMock = jest.fn();
      const hookSetMock = jest.fn();
      hookGetMock.mockImplementation(() => hookGetRef);
      const getHookReturnRef = {
        get: hookGetMock,
        set: hookSetMock,
      };
      getHookMock.mockImplementation(() => getHookReturnRef);
      hookGetMock.mockImplementation(() => ({ value: null }));

      const fnMock = jest.fn();
      const memoRef = {};
      fnMock.mockImplementation(() => memoRef);

      const memo = useMemo(fnMock);

      expect(getHookMock).toHaveBeenCalledTimes(1);
      expect(getHookMock.mock.calls[0].length).toBe(0);

      expect(fnMock).not.toHaveBeenCalled();
      expect(hookGetMock).toHaveBeenCalledTimes(1);
      expect(hookSetMock).not.toHaveBeenCalled();
      expect(memo).not.toBe(memoRef);
      expect(memo).toBe(null);
    });

    it('should store an array of conditions on the hook', () => {
      const hookGetRef = {};
      const hookGetMock = jest.fn();
      const hookSetMock = jest.fn();
      hookGetMock.mockImplementation(() => hookGetRef);
      const getHookReturnRef = {
        get: hookGetMock,
        set: hookSetMock,
      };
      getHookMock.mockImplementation(() => getHookReturnRef);
      hookGetMock.mockImplementation(() => undefined);

      const fnMock = jest.fn();
      const memoRef = {};
      fnMock.mockImplementation(() => memoRef);

      const conditionsRef = [];
      const memo = useMemo(fnMock, conditionsRef);

      expect(fnMock).toHaveBeenCalledTimes(1);
      expect(hookGetMock).toHaveBeenCalledTimes(1);
      expect(hookSetMock).toHaveBeenCalledTimes(1);
      expect(hookSetMock.mock.calls[0][0]).toMatchObject({ value: memoRef, conditions: conditionsRef });
      expect(memo).toBe(memoRef);
    });

    it('should not run the fnMock if an empty array of conditions is passed', () => {
      const hookGetRef = {};
      const hookGetMock = jest.fn();
      const hookSetMock = jest.fn();
      hookGetMock.mockImplementation(() => hookGetRef);
      const getHookReturnRef = {
        get: hookGetMock,
        set: hookSetMock,
      };
      getHookMock.mockImplementation(() => getHookReturnRef);
      hookGetMock.mockImplementation(() => undefined);

      const fnMock = jest.fn();
      const memoRef = {};
      fnMock.mockImplementation(() => memoRef);

      const conditionsRef = [];
      let memo = useMemo(fnMock, conditionsRef);

      expect(fnMock).toHaveBeenCalledTimes(1);
      expect(hookGetMock).toHaveBeenCalledTimes(1);
      expect(hookSetMock).toHaveBeenCalledTimes(1);
      expect(hookSetMock.mock.calls[0][0]).toMatchObject({ value: memoRef, conditions: conditionsRef });
      expect(memo).toBe(memoRef);

      hookGetMock.mockImplementation(() => ({ value: null, conditions: [] }));
      useMemo(fnMock, conditionsRef);
      expect(hookGetMock).toHaveBeenCalledTimes(2);
      expect(fnMock).toHaveBeenCalledTimes(1);
      expect(hookSetMock).toHaveBeenCalledTimes(1);
      expect(hookSetMock.mock.calls[0][0]).toMatchObject({ value: memoRef, conditions: conditionsRef });
    });

    it('should run the fnMock if the conditions array is a different length than the nextConditions array', () => {
      const hookGetRef = {};
      const hookGetMock = jest.fn();
      const hookSetMock = jest.fn();
      hookGetMock.mockImplementation(() => hookGetRef);
      const getHookReturnRef = {
        get: hookGetMock,
        set: hookSetMock,
      };
      getHookMock.mockImplementation(() => getHookReturnRef);
      hookGetMock.mockImplementation(() => undefined);

      const fnMock = jest.fn();
      const memoRef = {};
      fnMock.mockImplementation(() => memoRef);

      const conditionsRef = ['one'];

      hookGetMock.mockImplementation(() => ({ value: null, conditions: [] }));
      useMemo(fnMock, conditionsRef);
      expect(fnMock).toHaveBeenCalledTimes(1);
      expect(hookGetMock).toHaveBeenCalledTimes(1);
      expect(hookSetMock).toHaveBeenCalledTimes(1);
      expect(hookSetMock.mock.calls[0][0]).toMatchObject({ value: memoRef, conditions: conditionsRef });
    });

    it('should run the fnMock if any of the conditions has changed', () => {
      const hookGetMock = jest.fn();
      const hookSetMock = jest.fn();
      const getHookReturnRef = {
        get: hookGetMock,
        set: hookSetMock,
      };
      getHookMock.mockImplementation(() => getHookReturnRef);
      hookGetMock.mockImplementation(() => undefined);

      const fnMock = jest.fn();
      const memoRef = {};
      fnMock.mockImplementation(() => memoRef);

      const conditionsRef = ['one'];

      hookGetMock.mockImplementationOnce(() => ({ value: null, conditions: ['one'] }));
      useMemo(fnMock, conditionsRef);
      expect(fnMock).not.toHaveBeenCalled();
      expect(hookSetMock).not.toHaveBeenCalled();

      hookGetMock.mockImplementationOnce(() => ({ value: null, conditions: ['two'] }));
      useMemo(fnMock, conditionsRef);
      expect(fnMock).toHaveBeenCalledTimes(1);
      expect(hookSetMock).toHaveBeenCalledTimes(1);
      expect(hookSetMock.mock.calls[0][0]).toMatchObject({ value: memoRef, conditions: conditionsRef });
    });
  });

  describe('useContext', () => {
    let getContextValueMock;
    beforeEach(() => {
      getContextValueMock = jest.fn();
      contextController.getContextValue = getContextValueMock;
    });

    afterEach(() => {
      jest.resetAllMocks();
      jest.resetModules();
    });

    it('should be a function', () => {
      expect(useContext).toBeInstanceOf(Function);
    });

    it('should call getContextValue on the context controller', () => {
      const ctx = {};
      const ref = {};
      getContextValueMock.mockImplementation(() => ref);
      const contextValue = useContext(ctx);
      expect(getContextValueMock).toHaveBeenCalledTimes(1);
      expect(getContextValueMock).toHaveBeenCalledWith(ctx);
      expect(contextValue).toBe(ref);
    });
  });

  describe('useEffect', () => {
    let getHookMock;
    let addEffectMock;
    let setShouldExecuteMock;
    let effectRef;
    let fnRef;
    beforeEach(() => {
      getHookMock = jest.fn();
      addEffectMock = jest.fn();
      setShouldExecuteMock = jest.fn();
      fnRef = () => {};
      effectRef = {
        fn: fnRef,
        setShouldExecute: setShouldExecuteMock,
      };
      hookController.getHook = getHookMock;
      effectController.addEffect = addEffectMock;
      addEffectMock.mockImplementation(() => effectRef);
    });

    afterEach(() => {
      jest.resetAllMocks();
      jest.resetModules();
    });

    it('should be a function', () => {
      expect(useEffect).toBeInstanceOf(Function);
    });

    it('should throw an error if incorrect arguments are passed', () => {
      const getHookReturnRef = {
        get: () => {},
        set: () => {},
      };
      getHookMock.mockImplementation(() => getHookReturnRef);
      const fn = () => {};
      const arr = [];
      let message;
      expect(() => {
        useEffect(fn);
        useEffect(fn, arr);
      }).not.toThrow();

      expect(() => {
        useEffect(fn, 'not an array');
      }).toThrow('ValidationError');

      expect(() => {
        useEffect('not a function');
      }).toThrow('ValidationError');
    });

    it('should not pass an initial value to the getHookMock', () => {
      const getHookReturnRef = {
        get: () => {},
        set: () => {},
      };
      getHookMock.mockImplementation(() => getHookReturnRef);
      const fn = () => {};
      useEffect(fn);
      expect(getHookMock).toHaveBeenCalledTimes(1);
      expect(getHookMock.mock.calls[0].length).toBe(0);
    });

    it('should create an effect and set it on the hook if there is no effect on the hook', () => {
      const setMock = jest.fn();
      const componentRef = {};
      const getHookReturnRef = {
        get: () => undefined,
        set: setMock,
        component: componentRef,
      };
      getHookMock.mockImplementation(() => getHookReturnRef);
      addEffectMock.mockImplementation(() => effectRef);
      const fn = () => {};
      const arr = [];
      useEffect(fn, arr);
      expect(addEffectMock).toHaveBeenCalledTimes(1);
      expect(addEffectMock).toHaveBeenCalledWith(getHookReturnRef.component, fn, arr);

      expect(setMock).toHaveBeenCalledTimes(1);
      expect(setMock.mock.calls[0][0]).toMatchObject({ effect: effectRef });
    });

    it('should set the fn on the effect and call setShouldExecute', () => {
      const setMock = jest.fn();
      const componentRef = {};
      const getHookReturnRef = {
        get: () => ({ effect: effectRef }),
        set: setMock,
        component: componentRef,
      };
      getHookMock.mockImplementation(() => getHookReturnRef);
      const fn = () => {};
      const arr = [];
      useEffect(fn, arr);
      expect(addEffectMock).not.toHaveBeenCalled();
      expect(setMock).not.toHaveBeenCalled();

      expect(effectRef.fn).toBe(fn);
      expect(setShouldExecuteMock).toHaveBeenCalledTimes(1);
      expect(setShouldExecuteMock).toHaveBeenCalledWith(arr);
    });
  });

  describe('useRef', () => {
    let getHookMock;
    let getMock;
    let hookMock;
    beforeEach(() => {
      getHookMock = jest.fn();
      getMock = jest.fn();
      hookMock = {
        get: getMock,
      };
      getHookMock.mockReturnValue(hookMock);
      hookController.getHook = getHookMock;
    });

    it('should be a function', () => {
      expect(useRef).toBeInstanceOf(Function);
    });

    it('should throw an error if improper arguments are passed', () => {
      expect(() => {
        useRef('string');
        useRef(new DomRef('div'));
      }).not.toThrow();

      expect(() => {
        useRef({});
      }).toThrow('ValidationError');
    });

    it('should pass a domRef instance to the getHookMock', () => {
      useRef('div');
      expect(getHookMock).toHaveBeenCalledTimes(1);
      expect(getHookMock.mock.calls[0][0].elem.tagName).toBe('DIV');
      const ref = new DomRef('div');
      useRef(ref);
      expect(getHookMock).toHaveBeenCalledTimes(2);
      expect(getHookMock).toHaveBeenCalledWith(ref);
    });

    it('should return the data stored in the hook', () => {
      const returnRef = {};
      getMock.mockReturnValue(returnRef);
      const ref = useRef('div');
      expect(getHookMock).toHaveBeenCalledTimes(1);
      expect(getHookMock.mock.calls[0][0].elem.tagName).toBe('DIV');
      expect(getMock).toHaveBeenCalledTimes(1);
      expect(ref).toBe(returnRef);
    });
  });
});

describe('factories.createInfrastructure', () => {
  let createServicesMock;
  let createHooksMock;
  let svcMock;
  let hooksMock;

  beforeEach(() => {
    svcMock = {};
    hooksMock = {};
  });

  it('should be a function', () => {
    expect(factories.createInfrastructure).toBeInstanceOf(Function);
  });

  describe('services', () => {
    let svc;
    beforeEach(() => {
      createServicesMock = jest.spyOn(factories, 'createServices').mockReturnValue(svcMock);
      createHooksMock = jest.spyOn(factories, 'createHooks').mockReturnValue(hooksMock);
      const infra = factories.createInfrastructure();
      svc = infra.services;
    });

    it('should return an object', () => {
      expect(svc).toBeDefined();
      expect(Object.keys(svc)).toMatchObject([
        'clearContextValue',
        'getContextValue',
        'createApiContext',
        'addEffect',
        'createEffectContext',
        'destroyEffectContext',
        'digestEffects',
        'createHookContext',
        'destroyHookContext',
        'closeActiveHookContext',
        'setActiveHookContext',
      ]);
    });
  });

  describe('hooks', () => {
    let hooks;
    beforeEach(() => {
      const infra = factories.createInfrastructure();
      hooks = infra.hooks;
    });

    it('should return an object', () => {
      expect(hooks).toBeDefined();
      expect(Object.keys(hooks)).toMatchObject([
        'useContext',
        'useEffect',
        'useMemo',
        'useRef',
        'useState',
      ]);
    });
  });
});

describe('factories.contextController', () => {
  it('should be a ContextController', () => {
    expect(factories.contextController).toBeDefined();
    expect(factories.contextController).toBeInstanceOf(ContextController);
  });
});