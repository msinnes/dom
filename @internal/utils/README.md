# `@internal/utils`

An internal, shared utility library.

# API Functions

## createElement

A method that will output a valid dom render object from an input signature, props, and children. It's a function helper for outputting the same thing as a transpiled JSX file.

```TypeScript
const createElement = (signature, props, children) => {
  return {
    signature: signature,
    props: props || {},
    children: children || [],
  };
};
```

## cloneElement

A method that takes an input element and outputs a new dom render object. If props are passed, those props will be spread on to the output render object. If children are passed as a third argument, they will replace any children on the cloned object.

```JavaScript
const cloneElement = (
  { signature, props = {}, children }, // input component
  nextProps = {},
  nextChildren,
) => {
  return {
    signature,
    props: {
      ...props,
      ...nextProps,
    },
    children: nextChildren || children || [],
  };
};
```

# Exposed API

```js
export { cloneElement } from './fns/cloneElement';
export { createElement } from './fns/createElement';
```
