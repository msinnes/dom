import * as DOM from '@msinnes/dom';

import { CaseResolver } from '../classes/CaseResolver';
import { RedirectResolver } from '../classes/RedirectResolver';
import { RouterContext } from '../RouterContext';

const createResolver = ({ signature, props, children }) => {
  if (signature === Case) {
    return new CaseResolver(props.path, props.exact, props.render || children);
  } else if (signature === Redirect) {
    return new RedirectResolver(props.path, props.exact, DOM.createElement(Redirect, { to: props.to }));
  }
  throw new Error('ImplementationError: Switch components can only take Case and Redirect as children');
};

const findCurrentRouteChild = (resolvers = [], pathname) => {
  const len = resolvers.length;
  for (let i = 0; i < len; i++) {
    const resolver = resolvers[i];
    if (resolver.test(pathname)) {
      return resolver.resolve(pathname);
    }
  }
  return null;
};

const Case = () => {
  throw new Error('Case Components cannot be rendered');
};

const Redirect = ({ to }) => {
  const ctx = DOM.useContext(RouterContext);
  DOM.useEffect(() => ctx.navigate(to));
  return null;
};

const Switch = ({ children }) => {
  const { location } = DOM.useContext(RouterContext);
  const resolvers = DOM.useMemo(() => children.map(createResolver));
  const child = findCurrentRouteChild(resolvers, location.pathname);
  return child;
};

export { createResolver, findCurrentRouteChild, Case, Redirect, Switch };
