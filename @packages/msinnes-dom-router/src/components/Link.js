import * as DOM from '@msinnes/dom';

import { RouterContext } from '../RouterContext';

const Link = ({ to, children, ...linkProps }) => {
  const { basePath, navigate } = DOM.useContext(RouterContext);
  let props = { ...linkProps };
  if (to) {
    props = {
      ...props,
      onclick: e => {
        if (!basePath || basePath.test(to)) {
          e.preventDefault();
          navigate(to);
        }
      },
      href: to,
    };
  }
  return <a {...props}>{children}</a>;
};

export { Link };