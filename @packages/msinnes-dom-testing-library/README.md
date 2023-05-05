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

# Asynchronous Testing

Currently Timeouts and Intervals are supported. `requestAnimationFrame` is supported as well, but only basic animation logic should be unit tested at this time. Default behavior will run timers when the view 'digests.' The digest cycle begins once the dom view has rendered. If any handles have been opened during the render cycle -- if some component or service triggers an asynchronous action -- the renderer will process those handles, rendering the applcation and reprocessing recursively until the call stack is exhausted.

There is currently a maximum recursive depth of 50, just like there is with dom effect processing (component handles that execute after the render cycle). It is important to point out now that these recursive counters are disjoint. At any time during the digest process, recursive effect process starts at 0. Quantitatively, this means that any button click could trigger up to 2500 recursive operations. Qualitatively, it means that this testing framework empowers the user to test things like nested intervals. In the right hands, that kind of concept can be very powerful. If done wrong, nesting timers mixed with poor application design have the potential of creating long running tests.

## Timers

There are two main approaches when testing with timers in this package. One approach involves letting the library run the screen and process timers in order as they come. The other approach prevents automatic timer execution for granular testing.

---
### - Automated approach `Screen.time.play`

Let's say I am writing a test, and it is going to write a counter to the screen. The counter will increment every second.

```JavaScript
import * as DOM from '@msinnes/dom';
import { render } from '@msinnes/dom-testing-library';

const App = () => {
  const [count, setCount] = DOM.useState(0);
  const [text, setText] = DOM.useState('default text');
  DOM.useEffect(() => {
    setInterval(() => {
      setCount(count + 1);
      setText(`async text ${count}`);
    }, 1000);
  }, []);
  return text;
};

test('this could be a test written in any JavaScript testing library', () => {
  const screen = render(<App />);
  // At this point nothing asynchronous has processed.
  expect(screen.container.innerHTML).equals('default text');
  // We can run time for 1000 milliseconds.
  screen.time.play(1000);
  // The timer will execute once the app has 'ticked' 1000 times, digesting and rendering recursively.
  expect(screen.container.innerHTML).equals('async text 0');
  // Run time for 10 seconds.
  screen.time.play(10000);
  // The app will re-render 10 times.
  expect(screen.container.innerHTML).equals('async text 10');
});
```

We will say that this testing library exists and that the above tests are of how to implement it. We should note that although this library simulates browser behavior, it does so in a tightly controlled manner. The clock ticks in millisecond increments, and all code executes 'instantly' with respect to the ticking clock. Any handles left open during the render process will automatically, and the screen will do its best to behave just like a running browser.

---
### - Manual Approach `Screen.time.(next|run|tick)`

Now we are going to test an application with several timers, and we are going to pass a configuration to the render function.

```JavaScript
import * as DOM from '@msinnes/dom';
import { render } from '@msinnes/dom-testing-library';

const App = () => {
  const [count1, setCount1] = DOM.useState(0);
  const [text1, setText1] = DOM.useState('default text 1');
  const [count2, setCount2] = DOM.useState(0);
  const [text2, setText2] = DOM.useState('default text 2');
  const [text3, setText3] = DOM.useState('default text 3');
  DOM.useEffect(() => {
    setInterval(() => {
      setCount1(count1 + 1);
      setText1(`async text ${count1}}`);
    }, 500);
  }, []);
  DOM.useEffect(() => {
    setInterval(() => {
      setCount2(count2 + 1);
      setText2(`async text ${count2}`);
    }, 1000);
  }, []);
  DOM.useEffect(() => {
    setTimeout(() => {
      setText3(`async text`);
    }, 2000);
  }, []);
  return (
    <>
      <p>{text1}</p>
      <p>{text2}</p>
      <p>{text3}</p>
    </>
  );
};

test('this could be a test written in any JavaScript testing library', () => {
  const screen = render(<App />);
  // Nothing has happened.
  expect(screen.container.children[0].innerHTML).equals('default text 1');
  expect(screen.container.children[1].innerHTML).equals('default text 2');
  expect(screen.container.children[2].innerHTML).equals('default text 3');

  screen.time.tick(500);
  // We can execute the next timer, which will process the first interval
  screen.time.next();
  // The first node has updated.
  expect(screen.container.children[0].innerHTML).equals('async text 0');
  expect(screen.container.children[1].innerHTML).equals('default text 2');
  expect(screen.container.children[2].innerHTML).equals('default text 3');

  screen.time.tick(500);
  // We can execute the next timer, which will execute the first interval
  screen.time.next();
  // The first node has updated again.
  expect(screen.container.children[0].innerHTML).equals('async text 1');
  expect(screen.container.children[1].innerHTML).equals('default text 2');
  expect(screen.container.children[2].innerHTML).equals('default text 3');
  // We can execute the next timer, which will execute the second interval
  screen.time.next();
  // The second node has updated.
  expect(screen.container.children[0].innerHTML).equals('async text 1');
  expect(screen.container.children[1].innerHTML).equals('async text 0');
  expect(screen.container.children[2].innerHTML).equals('default text 3');

  // Advance the screen a full second.
  screen.time.tick(1000);
  // Execute expire timers
  screen.time.run();
  // All nodes have updated, but the first interval has only executed once when it should have run twice.
  expect(screen.container.children[0].innerHTML).equals('async text 2');
  expect(screen.container.children[1].innerHTML).equals('async text 1');
  expect(screen.container.children[2].innerHTML).equals('async text');
});
```

This example shows how to control timers manually. The last example shows that long running intervals do not accumulate. The library is designed to support this type of accumulation, but it will require a few changes to get that working correctly. The main issue comes because we have to limit timer execution to `once per tick.` Let's say we try and process an immediate interval, immediate code execution resolves to an exceeded call stack by definition. Because of this behavior an interval with 0 wait time will process the same as an interval with a wait time of 1.
