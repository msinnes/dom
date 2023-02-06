import { render } from '@new-msinnes/dom-testing-library';
import * as DOM from '@new-msinnes/dom';
import '@new-msinnes/dom-testing-library-jest';

import * as api from '..';

describe('e2e', () => {
  describe('initial-state-test-app', () => {
    const App = ({ text }) => {
      return text;
    };

    const mapStateToProps = state => {
      const s = { text: state };
      return s;
    };

    const ConnectedApp = api.connect(mapStateToProps)(App);

    const store = api.createStore(() => {}, 'redux text');

    const storeRender = DOM.createElement(api.StoreProvider, { store }, [DOM.createElement(ConnectedApp)]);

    let screen;
    beforeEach(() => {
      screen = render(storeRender);
    });

    it('should render an app with preleaded state', () => {
      expect(screen.container.textContent).toEqual('redux text');
    });
  });

  describe('item-list-test-app', () => {
    const actions = (function() {
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

      return { addItem, completeItem, deleteItem };
    })();

    const reducers = (function() {
      const itemReducer = (action, state = []) => {
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

      return { itemReducer };
    })();

    const ItemList = (function(a) {
      const { completeItem: completeItemAction, deleteItem: deleteItemAction } = a;

      const ListItem = ({ item, completeItem, deleteItem }) => {
        return DOM.createElement('li', {}, [
          DOM.createElement('span', {}, [item.completed ? DOM.createElement('del', {}, [item.title]) : item.title]),
          DOM.createElement('button', { type: 'button', onclick: () => completeItem(item) }, ['Complete']),
          DOM.createElement('button', { type: 'button', onclick: () => deleteItem(item) }, ['Delete']),
        ]);
      };

      const mapDispatchToProps = dispatch => ({
        completeItem: item => dispatch(completeItemAction(item)),
        deleteItem: item => dispatch(deleteItemAction(item)),
      })

      const ConnectedListItem = api.connect(undefined, mapDispatchToProps)(ListItem);

      const List = ({ items }) => DOM.createElement('ul', {}, [items.map(item => DOM.createElement(ConnectedListItem, { item }))])

      const ItemListComponent = ({ items, setInputOpen }) => {
        return [
          DOM.createElement('div', {}, [items.length ? DOM.createElement(List, { items }) : 'No Items Yet']),
          DOM.createElement('button', { type: 'button', onclick: () => setInputOpen(true) }, ['Add Item']),
        ];
      };

      const mapStateToProps = state => ({ items: state });

      const ConnectedItemList = api.connect(mapStateToProps)(ItemListComponent);
      return ConnectedItemList;
    })(actions);

    const AddItem = (function(a) {
      const { addItem: addItemAction } = a;

      const AddItem = ({ addItem, setInputOpen }) => {
        const [value, setValue] = DOM.useState('');
        const handleInputChange = e => {
          const val = e.data;
          setValue(val);
        };

        const handleSubmit = () => {
          addItem(value);
          setInputOpen(false);
        };

        return [
          DOM.createElement('input', { value, oninput: handleInputChange }),
          DOM.createElement('div', {}, [
            DOM.createElement('button', { type: 'button', onclick: handleSubmit }, ['Submit']),
            DOM.createElement('button', { type: 'button', onclick: () => setInputOpen(false) }, ['Close']),
          ]),
        ];
      };

      const mapDispatchToProps = dispatch => ({
        addItem: itemTitle => dispatch(addItemAction(itemTitle)),
      });

      const ConnectedAddItem = api.connect(undefined, mapDispatchToProps)(AddItem);
      return ConnectedAddItem;
    })(actions);

    const Content = (function(AddItemComponent, ItemListComponent) {
      const Content = () => {
        const [inputOpen, setInputOpen] = DOM.useState(false);

        return inputOpen ? (
          DOM.createElement(AddItemComponent, { setInputOpen })
        ) : (
          DOM.createElement(ItemListComponent, { setInputOpen })
        );
      };
      return Content;
    })(AddItem, ItemList);

    const store = api.createStore(reducers.itemReducer);
    const storeRender = DOM.createElement(api.StoreProvider, { store }, [DOM.createElement(Content)]);

    let screen;
    beforeEach(() => {
      screen = render(storeRender);
    });

    it('should render the app', () => {
      expect(screen.getByText('No Items Yet')).toBeOn(screen);
      expect(screen.getByText('Add Item')).toBeOn(screen);
    });

    it('should open the add form when the add item button is clicked', () => {
      screen.getByText('Add Item').click();
      expect(screen.getByRole('textbox')).toBeOn(screen);
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toEqual(2);
      expect(buttons[0]).toBeOn(screen);
      expect(buttons[1]).toBeOn(screen);
    });

    it('should render this list and cancel back to the original view', () => {
      screen.getByText('Add Item').click();
      expect(screen.getByRole('textbox')).toBe(screen.container.firstChild);
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toEqual(2);
      expect(screen.getByRole('textbox')).toBeOn(screen);
      expect(screen.getAllByRole('button')).toBeOn(screen);
      screen.getByText('Close').click();
      expect(screen.getByText('No Items Yet')).toBeOn(screen);
      expect(screen.getByText('Add Item')).toBeOn(screen);
    });

    it('should add items to the list', () => {
      screen.getByText('Add Item').click();
      screen.getByRole('textbox').oninput({ data: 'value' });
      screen.getByText('Submit').click();
      const li = screen.getByRole('listitem');
      expect(li).toBeOn(screen);
      expect(li.firstChild.textContent).toEqual('value');
      screen.getByText('Add Item').click();
      screen.getByRole('textbox').oninput({ data: 'value 2' });
      screen.getByText('Submit').click();
      const lis = screen.getAllByRole('listitem');
      expect(lis.length).toEqual(2);
      expect(lis[0]).toBe(screen.container.firstChild.firstChild.firstChild);
      expect(lis[1]).toBe(screen.container.firstChild.firstChild.firstChild.nextSibling);
      expect(lis).toBeOn(screen);
      const li1 = lis[0];
      const li2 = lis[1];

      expect(li1.firstChild.textContent).toEqual('value');
      expect(li2.firstChild.textContent).toEqual('value 2');
    });
  });
});