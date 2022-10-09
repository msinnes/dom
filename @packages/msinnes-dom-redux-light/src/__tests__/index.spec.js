import { render } from '@msinnes/dom-testing-library';

import * as api from '..';

import { StoreProvider } from '../StoreProvider';
import { createStore } from '../createStore';
import { combineReducers } from '../combineReducers';
import { connect } from '../connect';

import { App as InitialStateApp } from './initial-state-test-app';
import { App as ItemListApp } from './item-list-test-app';

describe('api', () => {
  it('should expose the correct items', () => {
    expect(api.StoreProvider).toBeDefined();
    expect(api.StoreProvider).toBe(StoreProvider);
    expect(api.connect).toBeDefined();
    expect(api.connect).toBe(connect);
    expect(api.createStore).toBeDefined();
    expect(api.createStore).toBe(createStore);
    expect(api.combineReducers).toBeDefined();
    expect(api.combineReducers).toBe(combineReducers);
  });
});

describe('e2e', () => {
  describe('initial-state-test-app', () => {
    let screen;
    beforeEach(() => {
      screen = render(<InitialStateApp />);
    });

    it('should render the preloaded state to the dom', () => {
      expect(screen.container.textContent).toEqual('redux text');
    });
  });

  describe('item-list-test-app', () => {
    let screen;
    beforeEach(() => {
      screen = render(<ItemListApp />);
    });

    it('should render the app', () => {
      expect(screen.getByText('No Items Yet')).toBeOnScreen(screen);
      expect(screen.getByText('Add Item')).toBeOnScreen(screen);
    });

    it('should open the add form when the add item button is clicked', () => {
      screen.getByText('Add Item').click();
      expect(screen.getByRole('textbox')).toBeOnScreen(screen);
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toEqual(2);
      expect(buttons).toBeOnScreen(screen);
    });

    it('should render this list and cancel back to the original view', () => {
      screen.getByText('Add Item').click();
      expect(screen.getByRole('textbox')).toBeOnScreen(screen);
      expect(screen.getAllByRole('button')).toBeOnScreen(screen);
      screen.getByText('Close').click();
      expect(screen.getByText('No Items Yet')).toBeOnScreen(screen);
      expect(screen.getByText('Add Item')).toBeOnScreen(screen);
    });

    it('should add items to the list', () => {
      screen.getByText('Add Item').click();
      screen.getByRole('textbox').oninput({ data: 'value' });
      screen.getByText('Submit').click();
      const li = screen.getByRole('listitem');
      expect(li).toBeOnScreen(screen);
      expect(li.firstChild.textContent).toEqual('value');
      screen.getByText('Add Item').click();
      screen.getByRole('textbox').oninput({ data: 'value 2' });
      screen.getByText('Submit').click();
      const lis = screen.getAllByRole('listitem');
      expect(lis).toBeOnScreen(screen);
      const li1 = lis[0];
      const li2 = lis[1];
      expect(li1.firstChild.textContent).toEqual('value');
      expect(li2.firstChild.textContent).toEqual('value 2');
    });
  });
});