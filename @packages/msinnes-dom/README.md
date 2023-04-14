# `@msinnes/dom`

## - A lightweight DOM rendering library.

At the top-level, the API is styled like ReactJS. There are class and function components along with hooks, but the API itself is much smaller. The Library itself is less than a fifth the size of React and React-Dom, and this library ports both functionality sets as a single unit. The library launches without an environment, so there is no need to import the library to use jsx.

## - No intermediate DOM logic.

This library gives the user direct access to the DOM without an intermediate virtal DOM. Any props passed to a DOM element in JSX are the exact same props that will be passed to the DOM element when it renders. Just so we are clear, that includes setting the value `innerHTML`. This library does not hold your hand in the way other libraries do. I suggest you brush up on your html best practices and read up on the OWASP top 10.

## - Part of a rendering Suite

`@msinnes/dom` is the core library of the `@msinnes/dom*` suite, and they are capable of quite a lot when working together. Front-end routing and state management are provided, and both can be tested and executed server side.

# The Rendering Paradigm

## - Structural Rendering

`@msinnes/dom` renders structurally. When an app renders, the input jsx is transformed to the DOM. During this process, a Virtual Application Tree is maintained based on the traversed jsx. As the application tree renders, any DOM nodes recognized along the way are written to the DOM.

Rather than doing a rigorous structural diff to determine if something needs to update or not, we traverse the entire application and update the DOM as we go. This adds the overhead for updating element props but removes the size and complexity of a diffing algorithm.

## - Technical Explanation (Skip this if you want)

The rendering is based on this idea: `Any subset of a set of tree nodes will form an implicit tree as long as the root node of the tree is present in the selected subset.` JSX (JavaScript/XML) is a way of functionally expressing XML and HTML is an XML specification. Any XML paradigm implies a tree structure, so we can tie our Application and DOM Trees by using our Context API. Like the React Context API, this one refereces the nearest parent provided value. Using a `DomParent Context`, we can pick the HTML subtree from the Application  tree. As we pick the DOM nodes, we can preserve the Application Node Ancestry in the subsequesnt DOM tree, which 'draws' a new tree. The shared root node and parent context allow us to write a full DOM tree on a single, pre-ordered traversal.

The real power of this algorithm can be expressed using a simple real-world example: `script` tags at the end of an html document. I ran into some intersting issues when I started `cypress` testing the API. If I wrote some jsx with a `div` element as the first child of the `body` element, it would follow that I should test that the first child of the `body` should be a `div`. Those tests failed because the saw a script tag. The `script` tag delivered as the last node of my HTML document was breaking my test. In most cases the script tag wound up as the first child of the document's `body`.

The algorithm broke the tests because it was appending to an empty list of children, but the browser doesn't see it that way. Instead of blindly appending to an array of children, the DOM context tracks nearest parent AND maintains a pointer to the current position in that parent's children. Because children can be nested, we have to track the position of nested parents, which means nested pointers up and down the context. Since I can write to the `body` element without having to account for `script` tags in the end-to-end tests, I know the algorithm tracks and updates correctly.

## - Simple, Reader Friendly Explanation

JSX, or JavaScript XML, is a means for expressing html rather than writing mutations in vanilla JavaScript. This library treats jsx as an object with 3 properties, signature, props, and children. These three properties coincide with the the properties on an XML's abstract syntax tree: tag, attributes, and children. We deliver the application's representation of the DOM directly to the browser.

## - Don't Be Lazy and Use This

This library does not abstract any logic, and it makes no assumptions on how or what you want to render to the DOM. For instance, React provides a very convenient `onChange` prop that will execute every time you perform an input on a form element. When you set the `onchange` prop on a DOM element, however, this is not the behavior. The `onchange` event handler only fires when an element loses focus. The correct event handler for handling user input is the `oninput` event. When implementing this library, there are no provided shortcuts. This allows us to keep the library small AND fast.

If I didn't scare you off with the `Mozilla` user documentation on input events, just wait. React tells you that setting the `innerHTML` prop is dangerous, and won't let you set that property directly. This is a `What You See Is What You Get` rendering library, and I will set any property you want on an element.

If you don't know why I am writing this warning here, then you need to study front end security safety measures before you continue programming in JavaScript.

# The DOM Interface

Enter the `DomRef` -- A `DomRef` is the central building block of the dom rendering ecosystem. A `DomRef` wraps every DOM element and gives the application a means of interacting with the DOM. These objects lie at the center of the dom ecosystem, and provide the connection between user and DOM.

The `DomRef` logic in this library provides maximum flexibility for `ref` usage. Rather than providing an intermediate virtual ref that has to be...honestly I don't know how React tracks refs...no idea. We don't do whatever that is here. These refs are wrappers around the DOM element, and can be rendered in line as a JSX signature.

```JavaScript
import { createRef } from '@msinnes/dom';

const Div = createRef('div');

createRef(document.body).render(<Div>Div Inner Text</Div>);
// document.body.innerHTML => <div>Div Inner Text</div>;
```

These refs are designed to take over the rendering ecosystem. Instead, these refs are used throughout the application to wrap elements, allowing for an extension of native rendering logic.

# Usage

### Install with your preferred package manager

With npm

```bash
npm install --save @msinnes/dom
```

With yarn

```bash
yarn add @msinnes/dom
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

With this we have the minimum required libraries to bundle an `@msinnes/dom` application.

At the top level of the application, we'll need a `.babelrc` and a `webpack.config.js`.

##### `.babelrc`
```json
{
  "presets": ["@msinnes/babel-preset-dom-jsx"]
}
```

##### `webpack.config.js`
```JavaScript
module.exports = {
  entry: {
    main: './index.js',
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
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

By adding a basic `index.js` we can show a small example of how to implement an `@msinnes/dom` application. The below application is a button with a click counter. The counter increments when the button is clicked.

##### `index.js`
```JavaScript
import { createRef, useState } from '@msinnes/dom';

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

createRef(document.body).render(<App />);
```

# API

The top-level method for rendering an application to the DOM. It takes two arguments, a jsx render and a DOM element. The element will act as a root node for the DOM portion of the input render. Any DOM elements processed during the render cycle will be rendered beneath the input element in the DOM tree.

## - `createRef`

A factory function for creating DOM interfaces within the `@msinnes/dom` ecosystem. The factory takes either a string or a DOM element as an argument, and returns an instance of `DomRef`.

```TypeScript
function createRef(elem: string | HTMLElement): DomRef;
```

The createRef function can take a string or an element, making this function the entrypoint for `@msinnes/dom` applications. First, create a dom ref from an existing dom node, and then render onto that ref.

```JavaScript
import { createRef } from '@msinnes/dom';

createRef(document.body).render((
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>
));
// document.body.innerHTML => <ul><li>Item 1</li><li>Item 2</li></ul>
```

A `DomRef` is allowed to take an existing HTML Element so users can render to a DOM element. In the above example, JSX will be rendered to the body element.

## - `Component`

An abstract class that can be extended for creating class components. Making your own class components involves 2 steps. First, extending the `Component` class. Second, implementing a render method that returns the desired render.

```JavaScript
import { renderApp, Component } from '@msinnes/dom';

class MyComponent extends Component {
  render() {
    return 'My DOM Text';
  }
}

renderApp(<MyComponent />, document.body);
// document.body.innerHTML => My Dom Text
```

**Technically, a render can be anything you want, but be careful. Unrecognized inputs render to the DOM as strings via the `toString` method.

#### `Component Lifecycle`

There are three component lifecycle methods exposed: `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount`. The first two are instance effects, and fire after the render cycle is complete. `componentWillUnmount` fires during the render cycle, and executes immediately before the component is destroyed.

These instance methods can only be assigned to class components that extends the `Component` class. They also grant the user access to other instance methods. This means that the user can trigger a rerender after the render cycle completes. Careful use of this feature is necessary to prevent infinite loops.

## - `createContext`

A factory function for the context API. The factory takes an optional `initialValue` as a parameter and returns a `Context` instance.

```TypeScript
type Context = {
  Provider: FunctionComponent,
  Consumer: FunctionComponent,
};

function createContext(initialValue: *): Context;
```

Each context has a `Provider` and a `Consumer`. Can take an initial value, or that value can be set by a provider. Consumers will return the value of the nearest provider in the Application tree, or will return the initial value if no Provider is present in the tree. An initial value is not required.

#### - Providing Context Values

```JavaScript
import { createContext } from '@msinnes/dom';

const { Provider } = createContext('initialValue');

const MyProvider = ({ myValue, children }) => (
  <Provider value={myValue}>
    {children}
  </Provider>
);
```

Values can be provided two ways, through a default value and through a provider implementation. In the above example, a wrapper component passes the data in the `myValue` prop to the `Provider`. This would cause all children beneath that provider to interpret the new value from the context.

#### - Class Component `contextType`

```JavaScript
import { createRef, Component, createContext } from '@msinnes/dom';

const ctx = createContext('initialValue');

class MyComponent extends Component {
  static contextType = ctx;

  render() {
    return this.context;
  }
}

createRef(document.body).render(<MyComponent />);
```

Contexts can be accessed statically in class components. In this case, the text 'initialValue' would be rendered inside the `body` element.

#### - Function Component `useContext`

```JavaScript
import { renderApp, useContext, createContext } from '@msinnes/dom';

const ctx = createContext('initialValue');

const MyComponent = () => {
  const value = useContext(ctx);

  return value;
};

renderApp(<MyComponent />, document.body);
```

Contexts can be accessed by the `useContext` hook in Function components. Like the class component example, this will render the text 'initialValue' inside of the `body` element.

#### - `Context.Consumer`

```JavaScript
import { renderApp, createContext } from '@msinnes/dom';

const { Consumer } = createContext('initialValue');

const MyComponent = () => (
  <Consumer>
    {value => value}
  </Consumer>
);

renderApp(<MyComponent />, document.body);
```

The context `Consumer` component can be used to access a context value through inline jsx. The component's first child must be a function, and the first parameter of the function will be the context value. The function should then return the desired render. This case would render the same way as the prior examples.

#### - I will go ahead and say now that the consumer part of the api was developed based on the React model, but the Consumer component isn't a really nice way of getting these values. The longevity of this feature is up for debate.

# Hooks

Hooks can be used in function components, and only function components. If you try and execute a hook outside of a rendering function component, it will throw an error. They are a specific piece of functionality, and they clearly have a defined workspace.

Hooks exist to optimize the use of Function Components in both this library and React. Function components with hooks are more expressive of functionality, and they are almost always capable of filling the place of a class component.

One note to keep in mind with hooks is that the same number of hooks need to execute in the same order. Any change in the number or order would cause massive issues internally. This means that conditional execution creates the potential for serious problems in your application. It is possible, but conditional execution of hooks is an absolute ANTIPATTERN . I'm not going to explain strategies to render hooks conditionally, but a keen mind could definitely accomplish it. Best of luck!

## - `useContext`

Allows the use of Contexts in function components. Takes a context as an argument and returns the current value of that context.

```TypeScript
function useContext(initialValue: *): *;
```

The current value is either the value provided by the nearest Provider in the Application tree, or it will be the initial value if there is no Provider present in the Application tree.

```JavaScript
import { createRef, useContext, createContext } from '@msinnes/dom';

const ctx = createContext('initialValue');

const MyComponent = () => {
  const value = useContext(ctx);

  return value;
};

createRef(document.body).render(<MyComponent />);
```

## - `useEffect`

Allows for implementing dom effects in function components. Dom effects are executed after updating the dom.

```TypeScript
function useEffect(effectFn: Function, depArr: Array<*>): void;
```

Any function returned from an effect can by used for cleanup. Cleanup functions are executed after the component is removed from the dom.

```JavaScript
const MyComponent = () => {
  useEffect(() => {
    // Store the original title value
    const originalTitle = window.title;
    window.title = 'MyComponent title';
    return () => {
      window.title = originalTitle;
    };
  });
  return 'myComponent render';
};
```

The above effect would update the title of the page on entry into the component, and reset the title when the component unmounts. This type of behavior is really useful for DOM interaction.

Effects will only run when the component is mounted to the DOM, but this will likely change to more closely resemble the React API. Effects can be re-executed by updating values in a dependency array.

```JavaScript
const MyComponent = () => {
  useEffect(() => {
    performQuery(location.query);
  }, [location.query]);

  return 'MyComponent render';
};
```

The above component's effect will execute every time the `location.query` value changes.

## - `useMemo`

Allows for memoizing information in a function component. This is best for information that doesn't need to be calculated on every render cycle.

```TypeScript
function useMemo(memoFn: Function, depArr: Array<*>): *;
```

Information will only be calculated on the first run of the function component, but can be recalculated by updating an element of a dependency array.

```JavaScript
const MyComponent = () => {
  const query = useMemo(() => {
    return parseQuery(location.query);
  }, [location.query]);

  return <MySuperSearchComponent query={query} />;
};
```

The above component is an example of parsing queryParams and passing them down into a search component. Every time `location.query` changes, the memo function will execute. Every time the memo function executes, the value returned from the hook will update. The data returned from the hook will be consistent on subsequent runs that don't re-execute the memo.

## - `useRef`

Allows for a singleton DOM reference, usable in function components that lack an instance reference.

```TypeScript
function useRef(elem: string | HTMLElement): DomRef;
```

The reference is memoized using the useMemo hook, and is only calculated when the component mounts. If the ref is then rendered to the dom via the function's returned render, it will be removed when the function component unmounts.

```JavaScript
const MyLabelComponentWithHooks = () => {
  const Div = useRef('div');
  return <Div>Label Text</Div>
};
```

The ref can be used inline as if it was a class or function component.

## - `useState`

Allows for use of state in function components. Returns a array with current state as the first element and a set function as the second element.

```TypeScript
function useState(initialState): [currentState: any, setter: Function];
```

If the set function is executed, the state will be updated and the application will be rerendered.

```JavaScript
const MyClickCounter = () => {
  const [count, setCount] = useState(0);
  return (
    <button type="button" onclick={() => setCount(count + 1)}>
      Click: {count}
    </button>
  );
};
```

The above component will increment a counter and display the value when a button is clicked. The count will be set to 0 initially, but it will increment every time the button is clicked. If the button is clicked twice, its text would read `Click: 2`.

##  Implementing without JSX
___

The following methods can be used to render an application without JSX. There are some other cases when these methods can be used to keep logic pure (not mutating elements when invoking the children prop is one example).

## - `createElement`

A method that will output a valid dom render object from an input signature, props, and children. It's a function helper for outputting the same thing as a transpiled JSX file.

```JavaScript
const createElement = (signature, props, children) => {
  return {
    signature: signature,
    props: props || {},
    children: children || [],
  };
};
```

That's pretty much it. Super simple helper.

## - `cloneElement`

A method that takes an input element and outputs a new dom render object. If props are passed, those props will be spread on to the output render object. If children are passed as a third argument, they will replace any children on the cloned object.

```JavaScript
const cloneElement = (
  { signature, props = {}, children }, // input component
  nextProps = {},
  nextChildren,
) => {
  return {
    signature,
    props: {
      ...props,
      ...nextProps,
    },
    children: nextChildren || children || [],
  };
};
```

Another super simple helper copied straight from the codebase.

# A Note About Renders

I created the above helper functions because writing out all of the component objects is very verbose and labor intensive; however, you can completely skip JSX and these helper functions by just writing all of your renders as objects with `signature`, `props`, and `children` properties.

```JavaScript
const render = {
  signature: 'ul',
  props: {},
  children: [
    {
      signature: 'li',
      props: {},
      children: ['Item 1'],
    },
    {
      signature: 'li',
      props: {},
      children: ['Item 2'],
    },
  ],
};
```

This is what JSX looks like when it transpiles. That said, anything can be a valid render in this specification. Things like empty strings, null, and undefined won't render anything to the DOM. Strings and Arrays are valid inputs. Strings render to the DOM as content, and arrays (interchangeable with JSX fragments) give us a means of grouping components.

Now, let's say you were to pass a `Date` instance into the render function. If the renderer comes across something it doesn't recognize, then the engine will call `toString` on the object. The string output is then rendered to the DOM.
