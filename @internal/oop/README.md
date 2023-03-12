# `@internal/oop`

A lightweight library for basic object oriented patterns not present in core JavaScript. These abstractions are all present at runtime.

# API Functions

## - abstract

Takes in a class and creates and abstract class, a class that will throw an error if instantiated without first extending the class.

```TypeScript
const abstract = T => abstract U extends T;
```

## - abstractMethod

Checks an instance for a function with the input name. This check should be called in a constructor, and inherently makes a class abstract.

```TypeScript
const abstractMethod = (instance, methodName) => void;
```

## - extendz

Checks if a class extends a superclass.

```TypeScript
const extendz = (Class, SuperClass) => boolean;
```

# Exposed API

```js
export { abstract } from './fns/abstract';
export { abstractMethod } from './fns/abstractMethod';
export { extendz } from './fns/extendz';
```
