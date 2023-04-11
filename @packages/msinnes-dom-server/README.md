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

`renderToString` is a function that takes in a JSX render and outputs a string. The input render can be anything renderable to the DOM with `@msinnes/dom`. Using a NodeJS server API, like ExpressJS, this library can provide prerendered HTML to a web browser.

```TypeScript
interface JSX = {
  signature: string | DomRef,
  props: object,
  children: JSXRender[],
}
/**
 * Any JSXRender that falls under `*` typing will be processed as a string by calling `toString`.
 */
type JSXRender = JSX | string | JSXRender[] | undefined | null | *;

function renderToString(JSXRender): string;
```


## - `renderToScreen`

`renderToScreen` is a function that takes in a JSX render and outputs a screen object, which can then be used to respond to the server request. The input render can be anything renderable to the DOM with `@msinnes/dom`. Using a NodeJS server API, like ExpressJS, this library can provide prerendered HTML to a web browser.

```TypeScript
interface JSX = {
  signature: string | DomRef,
  props: object,
  children: JSXRender[],
}

interface Screen = {
  html: string;
  url: string;
}

/**
 * Any JSXRender that falls under `*` typing will be processed as a string by calling `toString`.
 */
type JSXRender = JSX | string | JSXRender[] | undefined | null | *;

function renderToScreen(JSXRender): Screen;
```

# Usage

It is important to note that `renderToString` and `renderToScreen` only perform shallow renders of an application. The output string will only include a synchronous output base on the input render, processed effects, and associated data. It currently does not support asynchronous processes, which includes any call to change application state. I'm pretty sure any call to `setState` or `useState` will be ignord, but it could cause issues.

An example application can be found in the `@e2e/ssr-app` folder. This is a very basic application, but it works in the current end-to-end tests. In this process, each application has 2 entry points. The FE entry-point is in `pages/index.js` and is what gets built in `webpack.pages.config`.

When the server application is build, just before starting, the application will bundle with the routers importing the `pages/App.js` files. The server is built so that the JSX in the router file can be process easily in the server context. Essentially, this step of the build process allows us to keep from having to do something clever with requires. We just build pages and server seperately. When the server delivers a page for any given route, it returns the associated bundle.

These directions are a living document, and I will start adding more steps as I build toward page streaming.