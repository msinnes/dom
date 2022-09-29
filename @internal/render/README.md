# `@internal/render`

A base render library that is used by `BaseRender` for render abstraction.

## InternalBaseRender

The core, abstract render extended by other renders in this library.

## ArrayRender

The base render for arrays. Extends `InternalBaseRender`.

## EmptyRender

The base render for undefined and null. Extends `InternalBaseRender`.

## JSXRender

The base render for any JSX elements. Extends `InternalBaseRender`.

## StringRender

The base render for any string elements. Extends `InternalBaseRender`.
