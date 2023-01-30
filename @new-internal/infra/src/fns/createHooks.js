import { isArray, isFunction, isUndefined } from '@new-internal/is';

import { compareDepsArrs } from './compareDepsArrs';
import { Memo } from '../classes/Memo';

const createHookValidator = name => (fn, arr) => {
  const valid = isFunction(fn) && (isUndefined(arr) || isArray(arr));
  if (!valid) throw new Error(`ValidationError: ${name} takes a function and an optional array as arguments`);
};

const validateUseMemoArgs = createHookValidator('useMemo');

const createHooks = hookService => ({
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
