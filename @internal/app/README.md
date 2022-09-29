# `@internal/app`

Components, renders, and a renderer for performing application logic in the render process.

## AppRender

A class for app renders. Renders have a signature, props, and children. App renders are instances of `BaseRender`.

## BaseAppRenderer

An abstract class for rendering renders. It takes a render and renders components. Base App renderers are instances of `BaseRenderer`.

## components/abstract/AppComponent

Base component for application rendering. Extends `BaseComponent`.

## components/abstract/IdentativeComponent

Component for rendering items that do not change. Extends `AppComponent`.

## components/abstract/InteractiveComponent

Component for rendering items with which a user can interact. Extends `SignatureComponent`.

## components/abstract/SignatureComponent

Component for rendering items that update based on the input signature. Extends `AppComponent`.

## components/ArrayComponent

Component for rendering arrays of items. Extends `AppComponent`.

## components/ClassComponent

Component for rendering items with class logic. Extends `InteractiveComponent`.

## components/ElementComponent

Component for rendering elements to the DOM. Extends `SignatureComponent`.

## components/EmptyComponent

Component for rendering empty items that will not get rendered to the DOM. Extends `IdentativeComponent`.

## components/FunctionComponent

Component for rendering items with Function logic. Extends `InteractiveComponent`.

## components/TextComponent

Component for rendering text to the DOM. Extends `IdentativeComponent`.