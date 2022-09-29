const itemReducer = (action, state = []) => {
  console.log(action);
  switch(action.type) {
    case 'ADD_ITEM':
      return [
        ...state,
        {
          ...action.item,
          completed: false,
        },
      ];
    case 'COMPLETE_ITEM':
      return state.map(item => {
        if (item.id === action.item.id) {
          return {
            ...item,
            completed: true,
          };
        }
        return item;
      });
    case 'DELETE_ITEM':
      return state.filter(item => {
        return item.id !== action.item.id;
      });
    default:
      return state;
  }
};

export { itemReducer };
