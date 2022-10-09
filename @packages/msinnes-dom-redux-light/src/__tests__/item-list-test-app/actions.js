let id = 0;

const addItem = title => ({
  type: 'ADD_ITEM',
  item: {
    title,
    id: id++,
  },
});

const completeItem = item => ({
  type: 'COMPLETE_ITEM',
  item,
});

const deleteItem = item => ({
  type: 'DELETE_ITEM',
  item,
});

export { addItem, completeItem, deleteItem };
