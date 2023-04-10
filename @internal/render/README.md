# `@internal/render`

A base render library. "Reads" in the render using types construction of the sigrnature prop.

# API Classes

## - ArrayRender

Render class for array renders. Extends BaseRender.

```TypeScript
class ArrayRender extends BaseRender {}
```

## - BaseRender

Base render class. Hold nearly all necessary render functionality.

```TypeScript
abstract class BaseRender {}
```

## - ElementRender

Render class for element renders. Extends JSXRender.

```TypeScript
class ElementRender extends JSXRender {}
```

## - EmptyRender

Render class for null and undefined renders. Extends BaseRender.

```TypeScript
class EmptyRender extends BaseRender {}
```

## - JSXRender

Render class for JSX renders. Extends BaseRender.

```TypeScript
class JSXRender extends BaseRender {}
```

## - TextRender

Render class for text renders. Extends BaseRender.

```TypeScript
class TextRender extends BaseRender {}
```

# API Functions

## - iSJsxRender

Checks if an input render is a JSX render. Checks if the signature prop is a function.

```TypeScript
const iSJsxRender = (render: { signature: *, props: Object, children: Array }) => boolean;
```

## isElementRender

Checks if an input render is an element render. Checks if the signature prop is a string or a DomRef instance.

```TypeScript
const isElementRender = (render: { signature: *, props: Object, children: Array }) => boolean;
```

## isElementRender

Checks if an input render is an element render. Checks if the signature prop is a string or a DomRef instance.

```TypeScript
const isElementRender = (render: { signature: *, props: Object, children: Array }) => boolean;
```

## createRender

Takes in a user render, and parses it into an app render.

```TypeScript
const createRender => (render: { signature: *, props: Object, children: Array }) => BaseRender;
```

# Exposed API

```js
export { createRender } from './fns/createRender';
```
