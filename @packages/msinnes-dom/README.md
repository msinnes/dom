# `@msinnes/dom`

A lightweight DOM rendering library, and the core component to the `@msinnes/dom` rendering suite.

At the top-level, the API is styled like ReactJS. There are class and function components along with hooks, but the API itself is much smaller. The Library itself if less than a fifth the size of React. Gzipped, the core library is around 6Kb. The library launches without an environment, so there is no need to import the library the use jsx. This library extends the JavaScript specification to include jsx.

This library gives the user direct access to the DOM. Any props passed to an DOM element in JSX are the exact same props that will be passed to the DOM element when it renders. Just so we are clear, that includes setting the value `innerHTML`. I suggest you brush up on you're html best practices and read up on the OWASP top 10.

This library does not abstract any logic, and it makes no assumptions on how or what you want to render to the DOM. For instance, React provides a very convenient `onChange` prop that will execute every time you perform an input on a form element. When you set the `onchange` prop on a DOM element, however, this is not the behavior. The `onchange` event handler only fires when an element loses focus. The correct event handler for handling user input is the `oninput` event. When implementing this library, there are no provided shortcuts. This allows us to keep the library small AND fast.

# The Rendering Paradigm

`@msinnes/dom` renders structurally. When an app renders, the input jsx is transformed to the DOM. During this process, virutal structures for the Application and DOM are maintained. An `Application Tree` and a `Virtual DOM Tree` are constructed from the input renders as they execute. Subsequent renders are diffed and updated against these virtual structures.

JSX, or JavaScript XML, is a means for expressing html rather than writing mutations in vanilla JavaScript. This library treats jsx as an object with 3 properties, signature, props, and children. These three properties coincide with the the properties on an XML's abstract syntax tree: tag, attributes, and children. The renderer uses a pre-ordered, depth first traversal to interpret the view.

2 structures are maintained to manage the views, and application render and a DOM render. When the application undergoes a render process, the output is a DOM render. This DOM render is then passed to a DOM renderer, which updates the view. The 2 layer render process is why component lifecycle methods differ between the 2 libraries. This will change when the 2 layer system is replaced with a faster single layer system.

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
import { renderApp, useState } from '@msinnes/dom';

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

renderApp(<App />, document.body);
```

# API

## - `renderApp`

The top-level method for rendering an application to the DOM. It takes two arguments, a jsx render and a DOM element. The element will act as a root node for the DOM portion of the input render. Any DOM elements processed during the render cycle will be rendered beneath the input element in the DOM tree.

```TypeScript
function renderApp(render: JSXRender, element: HTMLElement): void;
```

The `renderApp` funtion acts as a `main` method would in a Java or C application. It is the starting point of render operations, and a simple html render would look something like the snippet below.

```JavaScript
import { renderApp } from '@msinnes/dom';

renderApp((
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>
), document.body);
```

**This part of the API is still unstable, and will likely change before or during `beta` development.

## - `createRef`

A factory function for creating DOM interfaces within the `@msinnes/dom` ecosystem. The factory takes either a string or a DOM element as an argument, and returns an instance of `DomRef`.

```TypeScript
function createRef(elem: string | HTMLElement): DomRef;
```

A `DomRef` is a wrapper class around DOM elements. It is used in two ways. At the top level, here, it gives the user way to interact with DOM elements. Internally, it wraps every DOM element and gives the application a means of interacting with the DOM. Refs created by this factory have a second purpose in the rendering process: they can be used as jsx signatures. Rather than provide the ref to the component as a prop, the ref is passed as the component's definition.

```JavaScript
import { renderApp, createRef } from '@msinnes/dom';

const Canvas = createRef('canvas');

function doStuffWithCanvas(canvasRef) {
  // The created/input element will live on the 'elem' prop.
  const { elem } = canvasRef;

  /**
   * Do stuff with the element.
   * In the case of a canvas element, we would call
   * canvas.getContext to draw on the surface.
   */
}

const App = () => {
  // renders the canvas to the DOM...poorly in this instance.
  useEffect(() => {
    doStuffWithCanvas(Canvas);
  }, []);

  return <Canvas />;
};

renderApp(<App />, docuument.body);
```

Although the `DomRef` class is not exposed to the user for extension, it is one of the essential building blocks of the rendering paradigm. After a few improvements inside the library, the refs provided by this utility will replace the need for the `renderApp` function altogether.

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
```

**Technically, a render can be anything you want, but be careful. Unrecognized inputs render to the DOM as strings via the `toString` method.

#### Component Lifecycle

The Component lifecycle is one of the unstable parts of the library. Currently, they do not work the way one would expect. The Application lifecycle and DOM lifecycle are disjoint. The application rendering process outputs a DOM render that is in turn rendered to the page.

All parts of the application lifecycle run prior to DOM execution, and this will change. There is a seperate API for executing DOM effects on class components, and this API will go away as well.

As of right now, use Function Components with Hooks. That API is stable and works more how you would expect. When the `beta` engine rebuild is finished, the lifecycle API will work almost the same as the React API.

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
import { renderApp, createContext } from '@msinnes/dom';

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
import { renderApp, Component, createContext } from '@msinnes/dom';

const ctx = createContext('initialValue');

class MyComponent extends Component {
  static contextType = ctx;

  render() {
    return this.context;
  }
}

renderApp(<MyComponent />, document.body);
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
import { renderApp, useContext, createContext } from '@msinnes/dom';

const ctx = createContext('initialValue');

const MyComponent = () => {
  const value = useContext(ctx);

  return value;
};

renderApp(<MyComponent />, document.body);
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
