import { RouterContext } from '../../RouterContext';
import { BaseRoute } from '../BaseRoute';

import { CaseResolver } from '../CaseResolver';

describe('CaseResolver', () => {
  it('should be a class', () => {
    expect(CaseResolver).toBeAClass();
  });

  it('should extend BaseRoute', () => {
    expect(CaseResolver).toExtend(BaseRoute);
  });

  describe('instance', () => {
    let instance;
    let renderRef = {};
    beforeEach(() => {
      instance = new CaseResolver('/path/', false, renderRef);
    });

    it('should have a render prop that is equal to the input render', () => {
      expect(instance.render).toBe(renderRef);
    });

    describe('resolve', () => {
      const paramsRef = {};

      beforeEach(() => {
        instance.getParams = jest.fn();
        instance.getParams.mockReturnValue(paramsRef);
      });

      it('should be a function', () => {
        expect(instance.resolve).toBeInstanceOf(Function);
      });

      it('should return the render prop', () => {
        const render = instance.resolve('/path');
        expect(render.signature).toBe(RouterContext.Provider);
        expect(render.props).toMatchObject({ value: {} });
        expect(render.children[0]).toBe(renderRef);
        expect(instance.getParams).toHaveBeenCalledTimes(1);
        expect(instance.getParams).toHaveBeenCalledWith('/path');
      });
    });
  });
});
