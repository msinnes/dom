import { Hook } from '../../classes/hooks/Hook';
import { Effect } from '../../classes/effect/Effect';

import { createHooks } from '../createHooks';

describe('createHooks', () => {
  let mockHookService;
  let mockEffectService;
  let mockContextService;
  let hooks;
  beforeEach(() => {
    mockHookService = {};
    mockEffectService = {};
    mockContextService = {};
    hooks = createHooks(mockHookService, mockEffectService, mockContextService);
  });

  it('should be a function', () => {
    expect(createHooks).toBeInstanceOf(Function);
  });

  describe('useContext', () => {
    let useContext;
    let getContextValueMock;
    beforeEach(() => {
      useContext = hooks.useContext;
      getContextValueMock = jest.fn();
      mockContextService.getContextValue = getContextValueMock;
    });

    it('should be a function', () => {
      expect(useContext).toBeInstanceOf(Function);
    });

    it('should pass he context to contextService.getContextValue and return the result', () => {
      const mockUserContext = {};
      const mockUserContextValue = {};
      mockContextService.getContextValue.mockReturnValue(mockUserContextValue);
      const ctxValue = useContext(mockUserContext);
      expect(ctxValue).toBe(mockUserContextValue);
      expect(getContextValueMock).toHaveBeenCalledTimes(1);
      expect(getContextValueMock).toHaveBeenCalledWith(mockUserContext);
    });
  });

  describe('useEffect', () => {
    let useEffect;
    let getHookMock;
    beforeEach(() => {
      useEffect = hooks.useEffect;
      getHookMock = jest.fn();
      mockHookService.getHook = getHookMock;
    });

    it('should throw an error if incorrect arguments are passed', () => {
      let hook;
      mockHookService.getHook = initialValue => {
        if (!hook) {
          hook = new Hook(initialValue);
        }
        return hook;
      };
      const fn = () => {};
      const arr = [];

      mockEffectService.addEffect = jest.fn().mockReturnValue(new Effect(fn));

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

    describe('without a dependency array', () => {
      it('should execute fn every time if no dependency array is passed', () => {
        const componentRef = {};
        let hook;
        mockHookService.getHook = initialValue => {
          if (!hook) {
            hook = new Hook(initialValue, componentRef);
          }
          return hook;
        };

        const fnMock = jest.fn();
        const fn = () => fnMock();

        mockEffectService.addEffect = jest.fn().mockReturnValue(new Effect(fn));

        useEffect(fn);

        const { effect } = hook.get();
        expect(effect.fn).toBe(fn);
        expect(effect.dependencies).toBeUndefined();
        expect(mockEffectService.addEffect).toHaveBeenCalledTimes(1);
        expect(mockEffectService.addEffect).toHaveBeenCalledWith(componentRef, fn, undefined);

        effect.exec();
        expect(fnMock).toHaveBeenCalledTimes(1);
        effect.exec();
        expect(fnMock).toHaveBeenCalledTimes(2);
      });
    });

    describe('with a dependency array', () => {
      it('should only execute once if the dependency array is empty', () => {
        const componentRef = {};
        let hook;
        mockHookService.getHook = initialValue => {
          if (!hook) {
            hook = new Hook(initialValue, componentRef);
          }
          return hook;
        };

        const fnMock = jest.fn();
        const fn = () => fnMock();
        const arr = [];

        mockEffectService.addEffect = jest.fn().mockReturnValue(new Effect(fn, arr));

        useEffect(fn, arr);

        const { effect } = hook.get();
        expect(effect.fn).toBe(fn);
        expect(effect.dependencies).toBe(arr);
        expect(mockEffectService.addEffect).toHaveBeenCalledTimes(1);
        expect(mockEffectService.addEffect).toHaveBeenCalledWith(componentRef, fn, arr);
        effect.nextDependencies = [];
        effect.exec();
        expect(fnMock).toHaveBeenCalledTimes(1);
        effect.nextDependencies = [];
        effect.exec();
        expect(fnMock).toHaveBeenCalledTimes(1);
      });

      it('should execute the effectFn if a dependency changes', () => {
        const componentRef = {};
        let hook;
        mockHookService.getHook = initialValue => {
          if (!hook) {
            hook = new Hook(initialValue, componentRef);
          }
          return hook;
        };

        const fnMock = jest.fn();
        const fn = () => fnMock();
        const arr = ['value'];

        mockEffectService.addEffect = jest.fn().mockReturnValue(new Effect(fn, arr));

        useEffect(fn, arr);

        const { effect } = hook.get();
        expect(effect.fn).toBe(fn);
        expect(effect.dependencies).toBe(arr);
        expect(mockEffectService.addEffect).toHaveBeenCalledTimes(1);
        expect(mockEffectService.addEffect).toHaveBeenCalledWith(componentRef, fn, arr);
        effect.nextDependencies = ['value'];
        effect.exec();
        expect(fnMock).toHaveBeenCalledTimes(1);
        effect.nextDependencies = ['value'];
        effect.exec();
        expect(fnMock).toHaveBeenCalledTimes(1);
        effect.nextDependencies = ['new value'];
        effect.exec();
        expect(fnMock).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('useMemo', () => {
    let useMemo;
    let getHookMock;
    beforeEach(() => {
      useMemo = hooks.useMemo;
      getHookMock = jest.fn();
      mockHookService.getHook = getHookMock;
    });

    it('should be a function', () => {
      expect(useMemo).toBeInstanceOf(Function);
    });

    it('should throw an error if incorrect arguments are passed', () => {
      let hook;
      mockHookService.getHook = initialValue => {
        if (!hook) {
          hook = new Hook(initialValue);
        }
        return hook;
      };
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

    describe('without a dependency array', () => {
      it('should calculate the memoized value the first time the method is called', () => {
        let hook;
        mockHookService.getHook = initialValue => {
          if (!hook) {
            hook = new Hook(initialValue);
          }
          return hook;
        };

        const memoRef = {};
        const fnMock = jest.fn().mockReturnValue(memoRef);
        const fn = () => fnMock();

        const memo = useMemo(fn);
        expect(memo).toBe(memoRef);
        expect(fnMock).toHaveBeenCalledTimes(1);
      });

      it('should only calculate the value once on subsequent calls', () => {
        let hook;
        mockHookService.getHook = initialValue => {
          if (!hook) {
            hook = new Hook(initialValue);
          }
          return hook;
        };

        const memoRef = {};
        const fnMock = jest.fn().mockReturnValue(memoRef);
        const fn = () => fnMock();

        let memo = useMemo(fn);
        expect(memo).toBe(memoRef);
        memo = useMemo(fn);
        expect(fnMock).toHaveBeenCalledTimes(1);
      });
    });

    describe('with a dependency array', () => {
      it('should only calculate the value once if the dependency array is empty', () => {
        let hook;
        mockHookService.getHook = initialValue => {
          if (!hook) {
            hook = new Hook(initialValue);
          }
          return hook;
        };

        const memoRef = {};
        const fnMock = jest.fn().mockReturnValue(memoRef);
        const fn = () => fnMock();
        const arr = [];

        let memo = useMemo(fn, arr);
        expect(memo).toBe(memoRef);
        memo = useMemo(fn, arr);
        expect(fnMock).toHaveBeenCalledTimes(1);
      });

      it('should only calculate the value once if the values in the array do not change', () => {
        let hook;
        mockHookService.getHook = initialValue => {
          if (!hook) {
            hook = new Hook(initialValue);
          }
          return hook;
        };

        const memoRef = {};
        const fnMock = jest.fn().mockReturnValue(memoRef);
        const fn = () => fnMock();
        const arr = ['value'];

        let memo = useMemo(fn, arr);
        expect(memo).toBe(memoRef);
        memo = useMemo(fn, arr);
        expect(fnMock).toHaveBeenCalledTimes(1);
      });

      it('should recalculate the value if a value in the array changes', () => {
        let hook;
        mockHookService.getHook = initialValue => {
          if (!hook) {
            hook = new Hook(initialValue);
          }
          return hook;
        };

        const memoRef = {};
        const fnMock = jest.fn().mockReturnValue(memoRef);
        const fn = () => fnMock();

        let memo = useMemo(fn, ['value']);
        expect(memo).toBe(memoRef);
        memo = useMemo(fn, ['new value']);
        expect(fnMock).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('useState', () => {
    let useState;
    beforeEach(() => {
      useState = hooks.useState;
    });

    it('should be a function', () => {
      expect(useState).toBeInstanceOf(Function);
    });

    it('should return the initial value and a setter function', () => {
      let hook;
      mockHookService.getHook = initialValue => {
        if (!hook) {
          hook = new Hook(initialValue);
        }
        return hook;
      };
      const [state, setState] = useState('initialValue');
      expect(state).toEqual('initialValue');
      expect(setState).toBeInstanceOf(Function);
    });

    it('should call component.setState', () => {
      let hook;
      const componentMock = {
        setState: jest.fn(),
      };
      mockHookService.getHook = initialValue => {
        if (!hook) {
          hook = new Hook(initialValue, componentMock);
        }
        return hook;
      };
      const [state, setState] = useState('initialValue');
      expect(state).toEqual('initialValue');

      setState('new value');
      expect(componentMock.setState).toHaveBeenCalledTimes(1);
      expect(componentMock.setState).toHaveBeenCalledWith(hook, 'new value');
    });
  });
});
