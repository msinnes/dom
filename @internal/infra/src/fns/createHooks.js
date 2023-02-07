import { isArray, isFunction, isUndefined } from '@internal/is';

import { Memo } from '../classes/Memo';

const createHookValidator = name => (fn, arr) => {
  const valid = isFunction(fn) && (isUndefined(arr) || isArray(arr));
  if (!valid) throw new Error(`ValidationError: ${name} takes a function and an optional array as arguments`);
};

const validateUseMemoArgs = createHookValidator('useMemo');
const validateUseEffectArgs = createHookValidator('useEffect');

const createHooks = (hookService, effectService, contextService) => ({
  useContext: userContext => contextService.getContextValue(userContext),
  useEffect: (effectFn, dependencies) => {
    validateUseEffectArgs(effectFn, dependencies);
    const hook = hookService.getHook();
    let { effect } = hook.get() || {};
    if (!effect) {
      effect = effectService.addEffect(hook.component, effectFn, dependencies);
      hook.set({ effect });
    }
    effect.fn = effectFn;
    effect.nextDependencies = dependencies;
  },
  useMemo: (memoFn, dependencies) => {
    validateUseMemoArgs(memoFn, dependencies);
    const hook = hookService.getHook();
    let { memo } = hook.get() || {};
    if (!memo) {
      memo = new Memo(memoFn, dependencies);
      hook.set({ memo });
    }
    return memo.getValue(dependencies);
  },
  useState: initialValue => {
    const hook = hookService.getHook(initialValue);
    return [hook.get(), newValue => {
      hook.component.setState(hook, newValue);
    }];
  },
});

export { createHooks };
