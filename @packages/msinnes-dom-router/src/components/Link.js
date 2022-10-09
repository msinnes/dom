import { navigate } from '../utils/navigate';

const Link = ({ to, children, ...linkProps }) => {
  // TODO: get navigate from the routing context.
  // TODO: get baseRoute from the routing context.
  let props = { ...linkProps };
  if (to) {
    props = {
      ...props,
      onclick: e => {
        // TODO: Only prevent default if the baseRoute is in the app.
        e.preventDefault();
        navigate(to);
      },
      href: to,
    };
  }
  return <a {...props}>{children}</a>;
};

export { Link };