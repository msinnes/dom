import * as DOM from '@msinnes/dom';

import { useParams } from '../hooks';

import { ParamsContext } from '../ParamsContext';

describe('hooks', () => {
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
      useContextMock.mockReturnValue(ctxValue);
      expect(useParams()).toBe(ctxValue);
      expect(useContextMock).toHaveBeenCalledTimes(1);
      expect(useContextMock).toHaveBeenCalledWith(ParamsContext);
      DOM.useContext = useContext;
    });
  });
});