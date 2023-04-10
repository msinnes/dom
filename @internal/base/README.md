# `@internal/base`

Base classes for rendering applications in browsers and server side.

# API Classes

## - BaseBrowserRenderController

The base rendering engine for browser development.

```TypeScript
class BaseBrowserRenderController extends BaseRenderController {}
```

## - BaseRenderController

The base rendering engine for the library.

```TypeScript
abstract class BaseRenderableComponent {}
abstract class BaseRenderController {}
```

## - BaseServerRenderController

The base rendering engine for the nodejs libs.

```TypeScript
class BaseServerRenderController extends BaseRenderController {}
```

## - Context

A context API for use throughout.

```TypeScript
class Context {}
```

## - Frame

A Frame and FrameQueue for processing state changes.

```TypeScript
class Frame {}
class FrameQueue {}
```

## - Renderer

An interface that traverses the input render(s) and applies those changes to the DOM.

```TypeScript
class Renderer {}
```

# Exposed API

These classes are exposed in the index file.

##### `.index.js`
```js
export { Context as BaseContext } from './classes/Context';
export { BaseBrowserRenderController } from './classes/BaseBrowserRenderController';
export { BaseServerRenderController } from './classes/BaseServerRenderController';
export { BaseRenderableComponent } from './classes/BaseRenderController';
```
