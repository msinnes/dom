# `is`

A lightweight library for checking types.

[comment]: <> (TODO: expand on the top-level docs)

```js
export { isArray } from './fns/array';
export { isFunction } from './fns/function';
export { isNull } from './fns/null';
export { isObjectLiteral } from './fns/object';
export { isString, isEmptyString } from './fns/string';
export { isUndefined } from './fns/undefined';
```

## array

Will identify arrays, just exposes the `Array.isArray` method.

## function

Will identify functions by checking if instance is an instance of `Function`.

## null

Will identify `null` by checking if input instance is explicitly equal to `null`.

## string

Will identify strings by checking `typeof` on the input instance.

## undefined

Will identify explicit undefineds by checking `typeof` o the input instance.
