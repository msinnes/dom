[comment]: <> (// TODO: make a pass on this)
# `@msinnes/babel-plugin-dom-jsx

A babel plugin for converting JSX to core JS syntax. Makes JSX compatible with the library `@msinnes/dom`.

## JSXElement

Will convert a JSX element into an `@msinnes/dom` render. Renders have a signature, props, and children. If the signature is a recognized html tag, then the signature will process as a string for writing to the dom; otherwise, the signature will be a variable descriptor.

## JSXFragment

Will convert a JSX fragment to an array of JSX elements.