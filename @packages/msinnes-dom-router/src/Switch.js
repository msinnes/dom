import { useMemo } from '@msinnes/dom';

import { navigate } from './utils/navigate';

import { CaseResolver } from './resolver/CaseResolver';
import { RedirectResolver } from './resolver/RedirectResolver';

const createResolver = ({ signature, props }) => {
  if (signature === Case) {
    return new CaseResolver(props.path, props.exact, props.render || props.children);
  } else if (signature === Redirect) {
    return new RedirectResolver(props.path, props.exact, () => navigate(props.to));
  }
  throw new Error('ImplementationError: Switch components can only take Case and Redirect as children');
};

const findCurrentRouteChild = (resolvers = []) => {
  const { pathname } = window.location;
  const len = resolvers.length;
  for (let i = 0; i < len; i++) {
    const resolver = resolvers[i];
    if (resolver.test(pathname)) return resolver.resolve();
  }
  return null;
};

const Case = () => {
  throw new Error('Case Components cannot be rendered');
};

const Redirect = ({ to }) => {
  navigate(to);
  return null;
};

const Switch = ({ children }) => {
  // TODO: it should update when there is a change in children
  const resolvers = useMemo(() => children.map(createResolver));
  return findCurrentRouteChild(resolvers);
};

export {
  createResolver,
  findCurrentRouteChild,
  Case,
  Redirect,
  Switch,
};