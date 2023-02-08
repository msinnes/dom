import * as DOM from '@msinnes/dom';

import { RouterContext } from '../RouterContext';

const Link = ({ to, children, ...linkProps }) => {
  const { baseRoute, navigate } = DOM.useContext(RouterContext);
  let props = { ...linkProps };
  if (to) {
    props = {
      ...props,
      onclick: e => {
        if (baseRoute.test(to)) {
          e.preventDefault();
          navigate(to);
        }
      },
      href: to,
    };
  }
  return DOM.createElement('a', {...props}, [children]);
};

export { Link };
