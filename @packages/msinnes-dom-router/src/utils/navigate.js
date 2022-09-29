const navigate = to => {
  let destination, state;
  if (typeof to === 'string') {
    destination = to;
    state = {};
  } else {
    destination = to.pathname;
    state = to.state;
  }
  setTimeout(() => {
    window.history.pushState(state, null, window.location.origin + destination);
    window.dispatchEvent(new PopStateEvent('popstate', { state }));
  });
};

export { navigate };