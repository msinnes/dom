# `@msinnes/dom-server`

A server-side rendering library for the `@msinnes/dom` stack. This is a simple library with a single function. The function, `renderToString` takes a render and gives back a rendered string of `html`.

The server-side rendering engine is the same engine used to render in `@msinnes/dom` and `@msinnes/dom-testing-library`. Rendering on the server is synchronous, and any async behavior in your application will be ignore at the current time.

## Usage

### Install with your preferred package manager

With npm

```bash
npm install --save @msinnes/dom @msinnes/dom-server
```

With yarn

```bash
yarn add @msinnes/dom @msinnes/dom-server
```

You'll also need to install some dev dependencies to bundle and deliver the application. We will use Webpack and Babel for this example. While Webpack isn't required, Babel is the only supported Transpiler at this time. To use JSX you will need `@msinnes/babel-preset-dom-jsx` or you'll need to pair `@msinnes/babel-plugin-dom-jsx` with `@babel/plugin-syntax-jsx`.

The dev install command would like like this with npm:

```bash
npm install --save-dev @msinnes/babel-preset-dom-jsx @babel/cli babel-loader webpack webpack-cli
```

or with yarn:

```bash
yarn add -D @msinnes/babel-preset-dom-jsx @babel/cli babel-loader webpack webpack-cli
```

With this we have the minimum required libraries to bundle an `@msinnes/dom` library with `@msinnes/dom-dever`. Webpack is required to bundle the client-side code for deliver, but the server side code is simple transpiled for execution.

At the top level of the application, we'll need a `.babelrc` and a `webpack.config.js`. The `.babelrc` file is used for both webpack bundling and transpiling the server code, while the `webpack.config.js` is used for bundling the verious pages.

##### `.babelrc`
```json
{
  "presets": ["@msinnes/babel-preset-dom-jsx"]
}
```

##### `webpack.config.js`
```JavaScript
const path = require('path');

const pages = ['index'];

const getEntry = pages => pages.reduce((acc, page) => ({
  ...acc,
  [page]: `./${page}.js`,
}), {});

module.exports = {
  entry: getEntry(pages),
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'public/pages'),
  },
  resolve: {
    extensions: ['.js'],
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js?/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
};
```

And by adding a basic `index.js` we can show a small example of how to render a simple `@msinnes/dom` application to a string.

##### `index.js` -
```JavaScript
import { renderToString } from '@msinnes/dom-server';

const html = renderToString(
  <div>Hello World!</div>
);

console.log(html);// logs: '<div>Hello World!</div>
```

# API

## - `renderToString`

`renderToString` is a function that takes a JSX render end outputs a string. The input render can be anything renderable to the DOM with `@msinnes/dom`, so I'll do my best with the typing below.

```TypeScript
interface JSX = {
  signature: string | DomRef,
  props: object,
  children: JSXRender[],
}

/**
  * JSXRender is technically type *. If the render is not recognized, let's say you pass in a Date object, then the toString method will be called on that unrecognized object.
  *
  * While anything can be passed, this typing represents the regonizable entities. Explicitly, the type would be 'any' or '*'.
  */
type JSXRender = JSX | string | JSXRender[] | undefined | null;

function renderToString(JSXRender): string;
```

It is important to note that `renderToString` only performs a shallow render of the application. The output string will only include a synchronous output base on the input render and associated date.
