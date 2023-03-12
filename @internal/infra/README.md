# `@internal/infra`

An infrastructure class wrapping context, effect, and hook functionality. Exposes these services and the associated hooks.

# API Classes

## - BaseDependencyHook

BaseClass for hooks that execute based on an array of dependencies.

```TypeScript
abstract class BaseDependencyHook {}
```

## - BaseService

BaseService that provides singletons (for the context api).

```TypeScript
abstract class BaseService {}
```

## - RemovableService

BaseService that provides instance based functionality (for effects and hooks).

```TypeScript
abstract class RemovableService {}
```

## - AppContext

An extension of the base context for use in applications.

```TypeScript
class AppContext extends BaseContext {}
```

## - ContextService

Provides contexts through all user application instances.

```TypeScript
class ContextService extends BaseService {}
```

## - UserContext

The provided UserContext with Privider and Consumer components.

```TypeScript
class UserContext {}
```

## - Effect

Effect class for Function components

```TypeScript
class Effect extends BaseDependencyHook {}
```

## - EffectService

Provides effect functionality throughout an application instance.

```TypeScript
class EffectService extends RemovableService {}
```

## - InstanceEffects

Wraps effect functionality for a component instance.

```TypeScript
class InstanceEffects {}
```

## - Hook

Base hook instance. Wraps an encapsulated value.

```TypeScript
class Hook {}
```

## - HookService

Provides hook functionality for an application instance.

```TypeScript
class HookService extends RemovableService {}
```

## - InstanceHooks

Wraps hook functionality for a component instance.

```TypeScript
class InstanceHooks {}
```

## - Infra

Provides application infrastructure.

```TypeScript
class Infra {}
```

## - Memo

Provides data and dependencies for the useMemo hook.

```TypeScript
class Memo extends BaseDependencyHook {}
```

# API Functions

## - createHooks

Creates application hooks.

```TypeScript
const createHooks = (hookService, effectService, contextService) => {
  useContext, useEffect, useMemo, useState,
};
```

## - createServices

Creates infrastructure services for hooks, effects, and contexts.

```TypeScript
const createServices = (hookService, effectService, contextService) => {
  closeActiveHookInstance,
  setActiveHookInstance,
  addClassEffect,
  addEffect,
  digestEffects,
  clearContextValue,
  getContextValue,
  createApiContext,
  destroyInstance,
  registerInstance,
};
```

# Exposed API

```js
export { Infra } from './classes/Infra';
```
