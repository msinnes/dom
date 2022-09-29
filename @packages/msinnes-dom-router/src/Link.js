import { navigate } from './utils/navigate';

const Link = ({ to = '', children, ...linkProps }) => {
  // TODO: get navigate from the routing context.
  // TODO: get baseRoute from the routing context.
  const props = { ...linkProps };
  if (to) props.onclick = e => {
    // TODO: Only prevent default if the baseRoute is in the app.
    e.preventDefault();
    navigate(to);
  };
  return <a {...props} href={to}>{children}</a>;
};

export { Link };