# `@internal/ssr`

Abstract layer for nodejs environment for http rendering, testing, etc.

# API Classes

## - DomScope

Wrapper for jsdom package. Enables and disables a request specific rendering environment.

```TypeScript
class DomScope {}
```

## - InfraScope

Wrapper for render infrastructure. Enables and disables a request specific rendering environment.

```TypeScript
class InfraScope {}
```

## - SsrScope

Top-level class for server side rendering. Wraps other ssr scopes. Enables and disables a request specific rendering environment.

```TypeScript
class SsrScope {}
```

# API Functions

## parseConfig

Parses ssr config from input user config. Passes necessary inputs to the necessary scopes.

```TypeScript
const parseConfig = (userConfig: Object) => appConfig: Object;
```

# Exposed API

```js
export { SsrScope } from './classes/SsrScope';
export { parseConfig } from './fns/parseConfig';
```