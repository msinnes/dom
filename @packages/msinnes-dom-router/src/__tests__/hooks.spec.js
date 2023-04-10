import * as DOM from '@msinnes/dom';

import {
  useLocation,
  useNavigate,
  useParams,
} from '../hooks';

import { RouterContext } from '../RouterContext';

describe('hooks', () => {
  describe('useLocation', () => {
    let useContextMock;
    beforeEach(() => {
      useContextMock = jest.fn();
    });

    it('should be a function', () => {
      expect(useLocation).toBeInstanceOf(Function);
    });

    it('should return the response of DOM.useContext', () => {
      const ctxValue = {};
      const useContext = DOM.useContext;
      DOM.useContext = useContextMock;
      useContextMock.mockReturnValue({ location: ctxValue });
      expect(useLocation()).toBe(ctxValue);
      expect(useContextMock).toHaveBeenCalledTimes(1);
      expect(useContextMock).toHaveBeenCalledWith(RouterContext);
      DOM.useContext = useContext;
    });
  });

  describe('useNavigate', () => {
    let useContextMock;
    beforeEach(() => {
      useContextMock = jest.fn();
    });

    it('should be a function', () => {
      expect(useNavigate).toBeInstanceOf(Function);
    });

    it('should return the response of DOM.useContext', () => {
      const ctxValue = {};
      const useContext = DOM.useContext;
      DOM.useContext = useContextMock;
      useContextMock.mockReturnValue({ navigate: ctxValue });
      expect(useNavigate()).toBe(ctxValue);
      expect(useContextMock).toHaveBeenCalledTimes(1);
      expect(useContextMock).toHaveBeenCalledWith(RouterContext);
      DOM.useContext = useContext;
    });
  });

  describe('useParams', () => {
    let useContextMock;
    beforeEach(() => {
      useContextMock = jest.fn();
    });

    it('should be a function', () => {
      expect(useParams).toBeInstanceOf(Function);
    });

    it('should return the response of DOM.useContext', () => {
      const ctxValue = {};
      const useContext = DOM.useContext;
      DOM.useContext = useContextMock;
      useContextMock.mockReturnValue({ params: ctxValue });
      expect(useParams()).toBe(ctxValue);
      expect(useContextMock).toHaveBeenCalledTimes(1);
      expect(useContextMock).toHaveBeenCalledWith(RouterContext);
      DOM.useContext = useContext;
    });
  });
});
