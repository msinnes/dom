# `@internal/dom`

Components, renders, and a renderer for performing dom logic in the render process. Also has DomElement and DomRef for controlling dom interaction.

## DomRender

A class for dom renders. Renders have a signature, props, and children. Dom renders are instances of `BaseRender`.

## DomRenderer

A class for rendering renders. It takes a render and renders components. Dom renderers are instances of `BaseRenderer`.

## DomComponent

Component for dom rendering. Extends `BaseComponent`.

## DomElement

Manages base dom interaction.

## DomRef

Contains base dom references.
