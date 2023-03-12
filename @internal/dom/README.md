# `@internal/dom`

Base Dom refs and node wrappers.

# API Classes

## - BaseDomNode

Base node wrapper class.

```TypeScript
abstract class BaseDomNode {}
```

## - DomRef

Base dom reference object. Directly wraps elements and is exposed for extension in top-level refs.

```TypeScript
class DomRef {}
```

## - ElementNode

The dom element node wrapper.

```TypeScript
class ElementNode extends BaseDomNode {}
```

## - RootNode

The root element node wrapper.

```TypeScript
class RootNode extends BaseDomNode {}
```

## - TextNode

The text node wrapper.

```TypeScript
class TextNode extends BaseDomNode {}
```

## - TextRef

Base text reference object

```TypeScript
class TextRef{}
```

# Exposed API

```js
export { DomRef } from './classes/DomRef';
export { ElementNode } from './classes/ElementNode';
export { RootNode } from './classes/RootNode';
export { TextNode } from './classes/TextNode';
export { TextRef } from './classes/TextRef';
```
