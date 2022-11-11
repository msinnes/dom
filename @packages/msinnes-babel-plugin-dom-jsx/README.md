# `@msinnes/babel-plugin-dom-jsx`

A babel plugin for converting JSX to core JS syntax. Makes JSX compatible with the library `@msinnes/dom`. Install the library using your prefered node package manager, and reference the plugin in your babel configuration. This plugin requires activation of jsx syntax in the babel parser, so `@babel/plugin-syntax-jsx` is necessary to have any affect on the code you want to transform.

Install with npm

```bash
npm install --save-dev @babel/plugin-syntax-jsx @msinnes/babel-plugin-dom-jsx
```

Install with yarn

```bash
yarn add -D @babel/plugin-syntax-jsx @msinnes/babel-plugin-dom-jsx
```

Example .babelrc
```json
{
  "plugins": ["@babel/plugin-syntax-jsx", "@msinnes/babel-plugin-dom-jsx"]
}
```


# Syntax conversion

The following AST nodes are transformed in this plugin: `JSXElement` and `JSXFragment`.

## JSXElement

Will convert a JSX element into an `@msinnes/dom` render. Renders have a signature, props, and children. If the signature is a recognized html tag, then the signature will process as a string for writing to the dom; otherwise, the signature will be a variable descriptor.

## JSXFragment

Will convert a JSX fragment to an array of JSX elements.