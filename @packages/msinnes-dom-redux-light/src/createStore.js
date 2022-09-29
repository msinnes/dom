const createStore = (rootReducer, preloadedState) => {
  const subscribers = [];
  let state = preloadedState || rootReducer({});

  const getState = () => state;
  const subscribe = handler => subscribers.push(handler);
  const dispatch = action => {
    state = rootReducer(action, state);
    subscribers.forEach(sub => sub({ getState }));
  };

  return { dispatch, getState, subscribe };
};

export { createStore };