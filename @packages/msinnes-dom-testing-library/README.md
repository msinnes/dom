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
    expect(button).toBeDefined();
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
    expect(reRenderedButton).toBeDefined();
  });
});
```

# API

## - `render`

 The enrtypoint for the API. The render function takes a JSX render as an input and returns a `screen`. Screens are an interactive wrapper over a rendered DOM. The render function works as a Screen factory, creating a screen and initiating the render process. The screen provides access to the root node, the `body` of the wrapped dom, and some helpful query functions. This is all experimental at this time, and many of the queries are likely to change.

 ```TypeScript
 function render(jsxRender: JSXRender, config?: renderConfig);
 ```

### - `config`

A configuration can be passed to the render function as a second argument. There is limited functionality, but it will expand as more features are added.

#### `runExpiredTimers -- Boolean`

Tells the rendering engine whether to run any timers that have expired. If a `setTimeout` is called without a second parameter or the second parameter is 0, the timer will execute inline with the render. This simulates clearing the call-queue with a render. Even if timers are nested, the simulated queue will run recursively until the queue is empty.

```JavaScript
import * as DOM from '@msinnes/dom';
import { render } from '@msinnes/dom-testing-library';

const App = () => {
  const [text, setText] = DOM.useState('default text');
  DOM.useEffect(() => {
    setTimeout(() => {
      setText('async text');
    });
  }, []);
  return text;
};

const screen1 = render(<App />); // Value defaults to true
const screen2 = render(<App />, { runExpiredTimers: false });

console.log(screen1.container.innerHTML); // <-- 'async text'
console.log(screen2.container.innerHTML); // <-- 'default text'
```

In this case `screen1` will render the text produced asynchronously, but `screen2` will render the default text. This allows for more control over the timers throughout the rendering process.

#### `url -- String`

The location to pass to `JSDOM` during page load. If no url is passed, the location will be the default location. This feature is required in order to render routed application on a server, or in a testing environment.

```JavaScript
// TODO: add an example after some work has been done on the ssr routing api. I need to make sure that the screen will render routing even if there is no url passed to the page.
```

## - `Screen`

The `Screen` class represents a user interface for rendering `@msinnes/dom` apps in a NodeJS environment. Although I have not found a use case outside of testing, this screen object could be used in any type of application. It is not tied to any testing environment. That said, the screen object is a good mechanism for testing rendered applications.

```JavaScript
import * as DOM from '@msinnes/dom';
import { render } from '@msinnes/dom-testing-library';

const screen = render(<div>text</div>);

expect(screen.container.innerHTML).toEqual('<div>text</div>');
```

Instances of the `Screen` class render atomically. It is entirely possible to render multiple applications simultaneously in the same test suite. Queries can be made against any screen object without worrying about affecting a query or action in an application rendered in parallel.


### `Screen.container`

The root visual element of rendered screen. Correspondes to the document.body element, not the ref associated with the element.

### `Screen.time`

The time interface for executing asyncronous timers. Depending on configuration, timers can run automatically, can be batch processed, or they can be executed one by one.

#### `Screen.time.next - () => void`

Processes the next expired timer associated with the screen instance. If no timers have expired, then nothing will happen.

#### `Screen.time.play - (ticks: ?number) => void`

Will tick all timers and digest the scope. If the screen is not configured to run expired timers (`runExpiredTimers = false`) then none of the timers will be executed. This allows the user to advance the clock and run any timers that expired in that time.

#### `Screen.time.runExpiredTimers - () => void`

Will run all timers that have expired, running them in expiration order. If no timers have expired, then no timers will execute.

### `Screen.(getBy|getAllBy|queryBy)* (Queries)`

Screen instances support DOM queries. There are three variations on all queries. `getBy` will query the DOM, throwing an error if nothing is found, or throwing an error if more than one result is found. `getAllBy` will query the DOM, throwing an error if no results are found. `queryBy` will run a base query on the dom, returning an array with found results if any exist. `queryBy` will not throw an error if no results are found.

#### `Screen.*ByLabelText`

A query family for querying by a form element's label text.

#### `Screen.*ByRole`

A query family for querying by an element's role.

#### `Screen.*ByText`

A query family for querying an element based on its text content.


