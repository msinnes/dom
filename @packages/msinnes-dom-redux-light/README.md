# `@msinnes/dom-redux-light`

A lightweight redux implementation and the associated tooling to interface the implementation alongside the `@msinnes/dom` rendering library. The library is based on React-Redux with it's own built in version of redux. By wrapping an application with a `StoreProvider`, application state data can be made available to the entire application via the `connect` function.

Redux uses reducer functions to manage encapsulated application state. Combining reducers via the `combineReducers` function gives the user the ability to construct complex state. State updates trigger an application render, allowing for progressive behavior in your application.

# Usage

### Install with your preferred package manager

With npm

```bash
npm install --save @msinnes/dom @msinnes/dom-redux-light
```

With yarn

```bash
yarn add @msinnes/dom @msinnes/dom-redux-light
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

With this we have the minimum required libraries to bundle an `@msinnes/dom` library with `@msinnes/dom-redux-light`.

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

And by adding a basic `index.js` we can show a small example of how to implement redux with `@msinnes/dom`. The below application has a div that displays a counter and a button to increment the counter.

##### `index.js`
```JavaScript
import { createRef } from '@msinnes/dom';
import { StoreProvider, connect, createStore } from '@msinnes/dom-redux-light';

// Action type for use in action and reducer
const ICREMENT_STATE = 'INCREMENT_STATE';

// Increment action
const incrementState = () => ({
  type: INCREMENT_STATE,
});

// Application reducer
const reducer = (action, state = 0) => {
  if (action.type === INCREMENT_STATE) return state + 1;
  return state;
};

const store = createStore(reducer);

// Provide the store to the application
const App = ({ state, increment }) => (
  <>
    <div>{state}</div>
    <button type="button" onclick={increment}>Increment</button>
  </>
);

const mapStateToProps = state => ({ state });
const mapDispatchToProps = dispatch => ({
  increment: () => dispatch(incrementState()),
});

// Tie the App component back into the store.
const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App);

createRef(document.body).render((
  <StoreProvider store={sotre}>
    <ConnectedApp />
  </StoreProvider>
));
```

# API

## - `createStore`

`createStore` is a function that takes a reducer and preloaded state. The function returns a `Store`. State can be any kind of data. The reducers, however they are combined into a top-level reducer, update state. The dispatch function exposes the ability to pass actions into reducers. Every time an action is dispatched, all store subscriptions will be executed. In the case of `@msinnes/dom-redux-light`, the subscription tells the `StoreProvider` component to trigger an app render;

```TypeScript
interface Store {
  dispatch: action => void,
  subscribe: subscriber => void,
  getState: () => *,
}

function createStore(reducer: Function, initialState: *): Store;
```

The `dispatch` function executes synchronously and there is not current middleware implementation. That means async actions require wrapping the store's `dispatch` function. An example could look something like this:

```JavaScript
import { createRef } from '@msinnes/dom';
import { createStore, StoreProvider } from '@msinnes/dom-redux-light';

import myReducer from '<path-to-reducer>';

const store = createStore(myReducer);

const storeDispatch = store.dispatch;

store.dispatch = action => {
  if (action.promise) {
    action.promise.then(data => storeDispatch({ ...action, data }));
  } else {
    storeDispatch(action);
  }
};

createRef(document.body).render(
  <StoreProvider store={store}>
    {/* Application Components */}
  </StoreProvider>
);
```

## - `combineReducers`

Composes as input map reducers into a top-level reducer function. When executed, each reducer will be executed with the input action, and the relevant piece of input state, the piece of state mapped to the same key as the reducer. Once all reducers have executed, the output state will be composed back onto an object with all pieces of state mapped to their relative key.

```TypeScript
interface Action {
  type: string,
}

interface ReducerMap {
  [key: string]: (action: Action, state: *) => *,
}

function combineReducers(ReducerMap): (action: Action, state: *) => *
```

If an application has 2 pieces of independent state, say userState and contentState, then those two independent reducers can be composed onto state.

```JavaScript
import { combineReducers, createStore } from '@msinnes/dom-redux-light';

import userReducer from './user-reducer';
import contentReducer from './content-reducer';

const rootReducer = combineReducers({
  user: userReducer,
  content: contentReducer,
});

const store = createStore(rootReducer);
```

The output of combined reducers is itself a reducer, so it can be passed to the `createStore` function. You can then compose reducers into a complex application state tree.

## - `StoreProvider`

An `@msinnes/dom` component that will subscribe to the store input via the store prop. This component should be wrapped around the root app component, as high as possible in the component tree since the store is passed down via a context provider. The application state provided by the store is made available to components via the `connect` function.

```JavaScript
import { StoreProvider } from '@msinnes/dom-redux-light';

// Provide the store to the application
const App = ({ state, increment }) => (
  <StoreProvider store={store}>
    <div>{state}</div>
    <button type="button" onclick={increment}>Increment</button>
  </StoreProvider>
);
```

## - `connect`

A curried function for passing application state to connected components. Components using application state should do so using this function, which will return a higher ordered component. The first invocation of the function takes a `mapStateToProps` function, a `mapDispatchToProps` function, and a `mergeProps` function and returns a new function. The second invocation of the function takes a component and returns a higher ordered component mapped to the application store.

```JavaScript
const mapStateToProps = state => ({ state });
const mapDispatchToProps = dispatch => ({
  increment: () => dispatch(incrementState()),
});

// Tie the App component back into the store.
const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(Component);
```

In the above example, the state prop is provided to the App Component by the `mapStateToProps` logic passed to the `connect` function. The increment prop, a function which dispatches the action `incrementState`, is provided by the `mapDispatchToProps` logic passed to the `connect` function.

There is a possible third argument that can be passed to the connect function, `mergeProps`, which will allow you to manually merge the final props passed to the connected component.

```JavaScript
const mergeProps = (propsFromState, propsFromDispatch, ownProps) => {
  return {
    ...ownProps,
    ...propsFromState,
    ...propsFromDispatch,
  };
};
```

The above example is a replication of the default behavior of the connect function when executing in the application, so there is no need to pass this as an argument. You need to overwrite this behavior in the third argument when this default functionality will cause props to be overwritten by duplicate identifiers.

# Actions and Reducers

Although actions and reducers are not part of the API itself, they are a pretty central part of the architecture. An action could be anything really, but it has to be read correctly in the reducer. By convention, actions have a `type` property that is read in the reducer.

In this small example we showed above, there is a single piece of state and a sindle action creator.

```JavaScript
// Action type for use in action and reducer
const ICREMENT_STATE = 'INCREMENT_STATE';

// Increment action
const incrementState = () => ({
  type: INCREMENT_STATE,
});

// Application reducer
const reducer = (action, state = 0) => {
  if (action.type === INCREMENT_STATE) return state + 1;
  return state;
};
```

The only thing necessary for operation in the api is for the reducer signature and return to conform to the api. The first argument passed to the reducer is the action, which we said could be anything. The second argument is the current state. Whatever is returned from the reducer will be placed in application state, so it is usually a good practice to return something from the reducer by default.
