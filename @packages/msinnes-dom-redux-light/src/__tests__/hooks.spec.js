import * as DOM from '@msinnes/dom';

import {
  useStore,
  useDispatch,
  useSelector,
} from '../hooks';

import { StoreContext } from '../StoreContext';

describe('hooks', () => {
  describe('useStore', () => {
    let useContextMock;
    beforeEach(() => {
      useContextMock = jest.fn();
    });

    it('should be a function', () => {
      expect(useStore).toBeInstanceOf(Function);
    });

    it('should return the response of DOM.useContext', () => {
      const store = {};
      const useContext = DOM.useContext;
      DOM.useContext = useContextMock;
      useContextMock.mockReturnValue(store);
      expect(useStore()).toBe(store);
      expect(useContextMock).toHaveBeenCalledTimes(1);
      expect(useContextMock).toHaveBeenCalledWith(StoreContext);
      DOM.useContext = useContext;
    });
  });

  describe('useDispatch', () => {
    let useContextMock;
    beforeEach(() => {
      useContextMock = jest.fn();
    });

    it('should be a function', () => {
      expect(useDispatch).toBeInstanceOf(Function);
    });

    it('should return the response of DOM.useContext', () => {
      const store = { dispatch: () => {} };
      const useContext = DOM.useContext;
      DOM.useContext = useContextMock;
      useContextMock.mockReturnValue(store);
      expect(useDispatch()).toBe(store.dispatch);
      expect(useContextMock).toHaveBeenCalledTimes(1);
      expect(useContextMock).toHaveBeenCalledWith(StoreContext);
      DOM.useContext = useContext;
    });
  });

  describe('useSelector', () => {
    let useContextMock;
    beforeEach(() => {
      useContextMock = jest.fn();
    });

    it('should be a function', () => {
      expect(useSelector).toBeInstanceOf(Function);
    });

    it('should return the response of DOM.useContext', () => {
      const mockState = {};
      const store = { dispatch: () => {}, getState: () => mockState };
      const useContext = DOM.useContext;
      DOM.useContext = useContextMock;
      useContextMock.mockReturnValue(store);
      expect(useSelector(state => state)).toBe(store.getState());
      expect(useContextMock).toHaveBeenCalledTimes(1);
      expect(useContextMock).toHaveBeenCalledWith(StoreContext);
      DOM.useContext = useContext;
    });
  });
});
