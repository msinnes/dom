# `@msinnes/dom-testing-library`

A jest testing library for `@msinnes/dom` applications. This testing library can be used to execute behavioral testing, end-to-end testing, and limited unit testing on rendered DOM components. The reason we call it 'limited unit testing' because we can't do direct unit testing on shallow rendered components. This library renders the components to a headless DOM (with JSDOM) and then provides an interface for querying that render.

The true power of this libary lies in the fact that screen renders are atomic. Multiple screens can be rendered in parallel. Assertions and actions can be executed independently from screen to screen. There is no deen for DOM cleanup. If a screen renders within the context of a single test, it will descope after the test run.

# Usage

### Install with your preferred package manager

With npm

```bash
npm install --save @msinnes/dom-testing-library
```

With yarn

```bash
yarn add @msinnes/dom-testing-library
```

You'll also need to install some dev dependencies to to transpile the code and execute the tests. Babel is the only supported Transpiler at this time, and Jest is required for the library. These dependencies could very well change with time, but they are neccessary at this time. As far as transpiling is concerned, using JSX will require `@msinnes/babel-preset-dom-jsx` or you'll need to pair `@msinnes/babel-plugin-dom-jsx` with `@babel/plugin-syntax-jsx`.

The dev install command would like like this with npm:

```bash
npm install --save-dev @msinnes/dom @msinnes/babel-preset-dom-jsx jest
```

or with yarn:

```bash
yarn add -D @msinnes/dom @msinnes/babel-preset-dom-jsx jest
```

With this we have the minimum required libraries to test with `@msinnes/dom-testing-library`.

At the top level of the application, we'll need a `.babelrc` file.

##### `.babelrc`
```json
{
  "presets": ["@msinnes/babel-preset-dom-jsx"]
}
```

A jest configuration will match tests.

##### `jest.config.js`
```JavaScript
module.exports = {
  testMatch: ['**/*.test.js'],
};
```

We can construct a simple application.

##### `index.js`

```JavaScript
import { useState } from '@msinnes/dom';

const App = () => {
  const [count, setCount] = useState(0);
  return (
    <button
      onclick={() => setCount(count + 1)}
    >
      Click (Click'd: {count})
    </button>
  );
};

export { App };
```

We can now add a test file and test our application.

##### `index.test.js`

```JavaScript
import { render } from '@msinnes/dom-testing-library';

import { App } from './App';

describe('App', () => {
  it('should render to the DOM', () => {
    // render the screen
    const screen = render(<App />);
    // query for the button
    const button = screen.getByText('Click (Click\'d: 0)');
    // assert that the button is on screen
    expect(button).toBeOnScreen(screen);
  });

  it('should increment the counter', () => {
    // render the screen
    const screen = render(<App />);
    // query for the button
    const button = screen.getByText('Click (Click\'d: 0)');
    // click the button
    button.click();
    // check for the next expected render
    const reRenderedButton = screen.getByText('Click (Click\'d: 1)');
    // assert that the button is on screen
    expect(reRenderedButton).toBeOnScreen(screen);
  });
});
```

# API

## - `render`

 The enrtypoint for the API. The render function takes a JSX render as an input and returns a `screen`. Screens are an interactive wrapper over a rendered DOM. The render function works as a Screen factory, creating a screen and initiating the render process. The screen provides access to the root node, the `body` of the wrapped dom, and some helpful query functions. This is all experimental at this time, and many of the queries are likely to change.

 ```TypeScript
 function render(jsxRender: JSXRender, config?: renderConfig);
 ```

There is some limited functionality that can be configured when the render function creates the screen. This functionality will be expanded in the next release along with a round of changes to the queries.

This part of the library is unstable, and documentation will be expanded in an upcoming release.
