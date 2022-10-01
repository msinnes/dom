import { isArray } from '@internal/is/array';
import { isFunction } from '@internal/is/function';
import { isUndefined } from '@internal/is/undefined';
import { isString, isEmpty } from '@internal/is/string';
import compareDepsArrs from '@internal/utils/compareDepsArrs';
import { DomRef } from '@internal/dom/DomRef';
import { ContextController } from './ctx/ContextController';
import { EffectController } from './effect/EffectController';
import { HookController } from './hooks/HookController';

export const createServices = (contextController, effectController, hookController) => ({
  // expose contextController methods
  clearContextValue: signature => contextController.clearContextValue(signature),
  getContextValue: ctx => contextController.getContextValue(ctx),
  createApiContext: defaultValue => contextController.createContext(defaultValue),
  // exposed effectController methods
  addEffect: (instance, effect) => effectController.addEffect(instance, effect),
  createEffectContext: instance => effectController.createContext(instance),
  destroyEffectContext: instance => effectController.destroyContext(instance),
  digestEffects: () => effectController.digest(),
  // exposed hookController methods
  createHookContext: instance => hookController.createContext(instance),
  destroyHookContext: instance => hookController.destroyContext(instance),
  closeActiveHookContext: () => hookController.closeActiveContext(),
  setActiveHookContext: instance => hookController.setActiveContext(instance),
});

const createHookValidator = name => (fn, arr) => {
  const valid = isFunction(fn) && (isUndefined(arr) || isArray(arr));
  if (!valid) throw new Error(`ValidationError: ${name} takes a function and an optional array as arguments`);
};

const validateUseMemoArgs = createHookValidator('useMemo');
const validateUseEffectArgs = createHookValidator('useEffect');

const validateUseRefArgs = ref => {
  const valid = isString(ref) || ref instanceof DomRef;
  if (!valid) throw new Error('ValidationError: useRef can only take a string or a DomRef as an argument');
};

export const createHooks = (contextController, effectController, hookController) => ({
  useContext: ctx => contextController.getContextValue(ctx),
  useEffect: (fn, arr) => {
    validateUseEffectArgs(fn, arr);
    const hook = hookController.getHook();
    let { effect } = hook.get() || {};
    if (isUndefined(effect)) {
      effect = effectController.addEffect(hook.component, fn, arr);
      hook.set({ effect });
    }
    effect.fn = fn;
    effect.setShouldExecute(arr);
  },
  useMemo: (fn, nextConditions) => {
    validateUseMemoArgs(fn, nextConditions);
    const hook = hookController.getHook();
    let { value, conditions } = hook.get() || {};
    if (isUndefined(value) || compareDepsArrs(conditions, nextConditions)) {
      value = fn();
      conditions = nextConditions;
      hook.set({ value, conditions });
    }
    return value;
  },
  useRef: inputRef => {
    validateUseRefArgs(inputRef);
    const ref = inputRef instanceof DomRef ? inputRef : new DomRef(inputRef);
    const hook = hookController.getHook(ref);
    return hook.get();
  },
  useState: initialValue => {
    const hook = hookController.getHook(initialValue);
    return [hook.get(), newValue => {
      hook.set(newValue);
      hook.component.setState();
    }];
  },
});

export const contextController = new ContextController();

export const createInfrastructure = () => {
  const effectController = new EffectController();
  const hookController = new HookController();

  return {
    services: createServices(contextController, effectController, hookController),
    hooks: createHooks(contextController, effectController, hookController),
  };
};