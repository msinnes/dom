# `@msinnes/dom-router`

A lightweight router implementation for use in Single Page Applications for `@msinnes/dom` applications. The whole library consists of a few components and hooks based on the top-level React Router API.

The API supports routing for single page applications, and prevents a full page refresh when the app can rerender without loading from the server. This allows for routed, progressive, front-end applications.

# Usage

### Install with your preferred package manager

With npm

```bash
npm install --save @msinnes/dom @msinnes/dom-router
```

With yarn

```bash
yarn add @msinnes/dom @msinnes/dom-router
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

With this we have the minimum required libraries to bundle an `@msinnes/dom` library with `@msinnes/dom-router`.

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

And by adding a basic `index.js` we can show a small example of how to implement routing with `@msinnes/dom`. The below application is a bare minimum example that renders a couple of links and changing the content with different routes.

##### `index.js`
```JavaScript
import { createRef } from '@msinnes/dom';
import { Router, Switch, Case, Redirect, Link, useParams } from '../..';

const Home = () => <div>Home</div>;
const About = () => <div>About</div>;
const Params = () => {
  const { id } = useParams();
  return <div>Param: {id}</div>;
};

const Nav = ({ children }) => (
  <ul>
    {children}
  </ul>
);

const NavItem = ({ children, ...rest }) => <li><Link {...rest}>{children}</Link></li>;

const Header = () => (
  <Nav>
    <NavItem to="/">Home</NavItem>
    <NavItem to="/about">About</NavItem>
    <NavItem to="/param/1">Params</NavItem>
    <NavItem to="/anything">Anything</NavItem>
  </Nav>
);

const Content = () => (
  <Switch>
    <Case path="/" render={<Home />} exact />
    <Case path="/about" render={<About />} />
    <Case path="/param/:id" render={<Params />} />
    <Redirect path="*" to="/about" />
  </Switch>
);

const App = () => (
  <Router>
    <Header />
    <Content />
  </Router>
);

createRef(document.body).render(<App />);
```

The app is a simple router component wrapping a Header and Content. The Header is a group of four links, and the Content is a Routing Switch with three content Cases and a default redirect. Two routes, `home` and `about` just print strings to the DOM, but the `params` route reads from the url, providing that value to the page's content.

# API

## - `Router`

An `@msinnes/dom` component that enable single page routing throughout the rest of the application component tree. Routing will only work within the Router's children, so it will need to be placed as high as possible in the component tree.

```JavaScript
import { Router } from '@msinnes/dom-router';

// Provide the store to the application
const App = ({ state, increment }) => (
  <Router>
    {/* Application Content*/}
  </Router>
);
```

The router takes an optional `basePath` prop. The `basePath` allows you to set the top level route of the single-page behavior. If the application is attempting to route, the default behavior is only interrupted if the  destination route is within the scope of the Router's `basePath`.

## - `Link`

A component that wraps anchor tag functionality in the DOM. The `Link` component will write a link to the DOM, with the `to` prop mapped to the href DOM property.

```JavaScript
<Link to="/about">About</Link>
// becomes => <a href="/about>About</a>
```

## - `Switch`

A component that wraps `Case` components and `Redirect` components. The `Switch` component resolves and renders the appropriate component based on the routing location. Switches render the value returned from the resolved component's render prop. In the case of a `Redirect`, the resolution will cause a page navigation.

Here is a very basic look at a `Switch` implementation:

```JavaScript
const Content = () => (
  <Switch>
    <Case path="/" render={<Home />} exact />
    <Case path="/about" render={<About />} />
    <Case path="/param/:id" render={<Params />} />
    <Redirect path="*" to="/about" />
  </Switch>
);
```

## - `Case`

A component that never actually renders. `Case` components can only exist within the context of a `Switch` parent component. They have a destination route on the `path` property, and it can be set to an exact match by adding the `exact` flag to the component. The `path` is compared to `location.pathname` and the value in the matched component's render prop will be returned.

```JavaScript
// with exact prop
<Case path="/" render={<Home />} exact />
<Case path="/about" render={<About />} />
// with route param, data passed in route will be placed on param.id
<Case path="/param/:id" render={<Params />} />
```

As an extra note, these components are not designed to render, and they will actually throw an error if an attempt is made to render them, even if they are inside a `Switch` component.

## - `Redirect`

A component that will redirect the application when rendered. Whether it's within the context of a switch component or rendered on it's own, a `Redirect` component does just what the name implies. These are typically used to manage default behavior.

```JavaScript
const Content = () => (
  <Switch>
    <Case path="/" render={<Home />} exact />
    <Case path="/about" render={<About />} />
    <Case path="/param/:id" render={<Params />} />
    <Redirect path="*" to="/about" />
  </Switch>
);
```

In this case a redirect will be performed if the `Switch` component does not match any `Case`. When it gets to the `Redirect`, it will match the wildcard on the `path` prop. When in the context of a `Switch`, the `path` prop on the `Redirect` will work the same as the `path` prop on a `Case` component.

Another useful example is redirecting before rendering private components.

```JavaScript
const PrivateComponent = ({ authorized }) => {
  if (!authorized) return <Redirect to="/login-page" />

  return {/* Private stuff */};
};
```

In either case, the app will redirect to the destination listed on the `to` prop.