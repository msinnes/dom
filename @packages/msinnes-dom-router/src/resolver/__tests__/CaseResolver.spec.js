import { ParamsContext } from '../../ParamsContext';
import { BaseRouteResolver } from '../BaseRouteResolver';
import { CaseResolver } from '../CaseResolver';

describe('CaseResolver', () => {
  it('should be a class', () => {
    expect(CaseResolver).toBeAClass();
  });

  it('should extend BaseRouteResolver', () => {
    expect(CaseResolver).toExtend(BaseRouteResolver);
  });

  describe('instance', () => {
    let instance;
    let renderRef = {};
    beforeEach(() => {
      instance = new CaseResolver('/path/', false, renderRef);
    });

    afterEach(() => {
      jest.resetAllMocks();
      delete global.window;
    });

    it('should have a regex props from createRouteRegex', () => {
      expect(instance.regex).toEqual(new RegExp('^\/path[\/]?'));
    });

    it('should have a test function that executes the regex.test method', () => {
      const testMock = jest.fn(() => true);
      instance.regex.test = testMock;
      const tested = instance.test('string');
      expect(testMock).toHaveBeenCalledTimes(1);
      expect(testMock).toHaveBeenCalledWith('string');
      expect(tested).toBe(true);
    });

    it('should have a render prop that is equal to the input render', () => {
      expect(instance.render).toBe(renderRef);
    });

    describe('getParams', () => {
      beforeEach(() => {
        global.window = {
          location: {
            pathname: '/param1/1/param2/2',
          }
        };
      });

      afterEach(() => {
        delete global.window;
      });

      it('should be a function', () => {
        expect(instance.getParams).toBeInstanceOf(Function);
      });

      it('should return an empty object if the regex finds 0 matches', () => {
        instance = new CaseResolver('/path', false, () => 'render');
        const params = instance.getParams();
        expect(params).toBeDefined();
        expect(params).toBeInstanceOf(Object);
        expect(Object.keys(params).length).toEqual(0);
      });

      it('should return an empty object if no param is found', () => {
        instance = new CaseResolver('/param1/1/param2/2', false, () => 'render');
        const params = instance.getParams();
        expect(params).toBeDefined();
        expect(params).toBeInstanceOf(Object);
        expect(Object.keys(params).length).toEqual(0);
      });

      it('should resolve params if they are found', () => {
        instance = new CaseResolver('/param1/:param1/param2/:param2');
        const params = instance.getParams();
        expect(params).toBeDefined();
        expect(params).toBeInstanceOf(Object);
        expect(params).toMatchObject({
          param1: '1',
          param2: '2',
        });
      });
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
        const render = instance.resolve();
        expect(render.signature).toBe(ParamsContext.Provider);
        expect(render.props).toMatchObject({ value: {} });
        expect(render.children[0]).toBe(renderRef);
      });
    });
  });
});