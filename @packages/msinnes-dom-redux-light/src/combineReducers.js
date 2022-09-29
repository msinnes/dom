const combineReducers = reducerMap => (action = {}, state = {}) => {
  let nextState = state;
  Object.keys(reducerMap).forEach(key => {
    nextState = {
      ...nextState,
      [key]: reducerMap[key](action, state[key]),
    };
  });
  return nextState;
};

export { combineReducers };