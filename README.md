# `@msinnes/dom*`

## Associated Libs

- [@msinnes/dom](/%40packages/msinnes-dom)
- [@msinnes/dom-redux-light](/%40packages/msinnes-dom-redux-light)
- [@msinnes/dom-router](/%40packages/msinnes-dom-router)
- [@msinnes/dom-server](/%40packages/msinnes-dom-server)
- [@msinnes/dom-testing-library](/%40packages/msinnes-dom-testing-library)
- [@msinnes/dom-testing-library-jest](/%40packages/msinnes-dom-testing-library-jest)
- [@msinnes/babel-plugin-dom-jsx](/%40packages/msinnes-babel-plugin-dom-jsx)
- [@msinnes/babel-preset-dom-jsx](/%40packages/msinnes-babel-preset-dom-jsx)

`@msinnes/dom*` is a Front End JavaScript rendering suite. The core rendering library, `@msinnes/dom` is a React style rendering api complete with JSX integration and hook support. The API itself is not identical, but the rendering paradigm, Context implementation, and hooks are all very similar. The JSX integration comes via babel, which is the only transpiler supported at this time. In addition to the core renderer, the suite includes a state manager and router, `@msinnes/dom-redux-light` and `@msinnes/dom-router`. There is also server-side rendering support in `@msinnes/dom-server` and `@msinnes/dom-testing-library`.

`@msinnes/dom-testing-library` and `@msinnes/dom-server` are almost identical from a rendering standpoint. Where they diverge is what happens after the page renders. `@msinnes/dom-testing-library` exposes a rendered, queryable screen. Although it was built with testing in mind, `@msinnes/dom-testing-library` is a server-side rendering api. `@msinnes/dom-server` exposes a screen object as well, but this screen is limited in what it exposes to the user. As of now, the current page url and html string are exposed on a rendered screen. The idea is expose all data necessary for pre-processing an html document, but more features are needed to fully pre-process a page.

The APIs in this library are all developed in Jest using a very test-driven pattern (which is why coverage is north of 95% across the board). Since there is so much going on in jest, I also exposed some really basic helpers for use with the testing library in `@msinnes/dom-testing-library-jest`.

# Features

This is just a starting list of features, and a short description of each. In time, I will do my best to cover all features with examples.

- Lightweight -- Flat bundled in ES6 (unminified) the library is 29kb. Flat bundled, minified, and gzipped, the library is 7kb, which puts it on par with Preact. Fully transpiled to ES5 and minified, the library is 49kb, 1/3 the size of React and React-Dom.
- No Import Statement -- This library doesn't require you to import it when it isn't used. You only import the API if you actually need to use it.
- Class Components -- Abstract Class component which can be extended and exposes three lifecycle methods: `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount`.
- Function Components -- Functions can be used with hooks to develop clean, expressive functionality.
- Hooks -- Hooks for almost anything you need to build a website, and they process server side without any problem.
- Limited Async Rendering Server Side -- Asynchronous processing will now run in both the server and testing environments. Timeouts and Intervals are currently supported as well as initial support for requestAnimationFrame.

This library delivers the functionality of React at the size of Preact. There is no engine swap, and a healthy suite of libraries is already available for routing, testing, and state management.


