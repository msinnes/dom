# `@internal/component`

A component library for application nodes.

# API Classes

## - BaseComponent

The base component extended by all components.

```TypeScript
abstract class BaseComponent {}
```

## - DomComponent

The base component for interfacing with the dom, and a class for managing ancestral dom interaction.

```TypeScript
abstract class DomComponent extends JSXComponent {}
class DomParent {}
```

## - JSXComponent

The base component for handling components built from jsx.

```TypeScript
abstract class JSXComponent extends BaseComponent {}
```

## - ArrayComponent

Component for handling arrays of components.

```TypeScript
class ArrayComponent extends BaseComponent {}
```

## - ClassComponent

Component for handling class based components.

```TypeScript
class ClassComponent extends JSXComponent {}
```

## - ElementComponent

Component for handling dom elements.

```TypeScript
class ElementComponent extends DomComponent {}
```

## - EmptyComponent

Component for handling null and undefined renders.

```TypeScript
class EmptyComponent extends BaseComponent {}
```

## - FunctionComponent

Component for handling function based components.

```TypeScript
class FunctionComponent extends JSXComponent {}
```

## - RootComponent

Component for anchoring the application to the DOM.

```TypeScript
class RootComponent extends DomComponent {}
```

## - TextComponent

Component for writing text to the DOM.

```TypeScript
class TextComponent extends DomComponent {}
```

# API Functions

## - createComponentFactory

A function that returns a function for creating components.

```TypeScript
const createComponentFactory = (BaseClass, domContext, services) => render => BaseComponent;
```

## - createRootComponent

A function for creating an application's root component

```TypeScript
const createRootComponent = (root, elem, domContext) => RootComponent;
```

# Exposed API

These classes are exposed in the index file.

##### `.index.js`
```js
export { createComponentFactory } from './fns/createComponentFactory';
export { createRootComponent } from './fns/createRootComponent';
```
