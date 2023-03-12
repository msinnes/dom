# `is`

A lightweight library for checking types.

# API Functions

## - isArray

Checks if input is an Array using `isArray`.

```TypeScript
const isArray = input => boolean;
```

## - isFunction

Checks if input is a function using `typeof`.

```TypeScript
const isFunction = input => boolean;
```

## - isNull

Checks if input is a function using `null` equality.

```TypeScript
const isNull = input => boolean;
```

## - isObjectLiteral

Checks if input is a is an object literal (`{}`). Checks `typeof` and excludes extending Objects.

```TypeScript
const isObjectLiteral = input => boolean;
```

## - isString

Checks if input is a string using `typeof`.

```TypeScript
const isString = input => boolean;
```

## - isEmptyString

Checks if input is a an empty string. Will throw an error if input is not a string, so it should be composed with `isString`.

```TypeScript
const isEmptyString = input => boolean;
```

## - isUndefined

Checks if input is undefined using `typeof`.

```TypeScript
const isUndefined = input => boolean;
```

# Exposed API

```js
export { isArray } from './fns/array';
export { isFunction } from './fns/function';
export { isNull } from './fns/null';
export { isObjectLiteral } from './fns/object';
export { isString, isEmptyString } from './fns/string';
export { isUndefined } from './fns/undefined';
```
