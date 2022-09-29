import { BaseRouteResolver } from '../BaseRouteResolver';
import { CaseResolver } from '../CaseResolver';

describe('CaseResolver', () => {
  it('should be a function', () => {
    expect(CaseResolver).toBeInstanceOf(Function);
  });

  describe('instance', () => {
    let instance;
    let renderRef = {};
    beforeEach(() => {
      instance = new CaseResolver('/path/', false, renderRef);
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should have a regex props from createRouteRegex', () => {
      expect(instance.regex).toEqual(/^\/path\//);
    });

    it('should extend BaseRouteResolver', () => {
      expect(instance).toBeInstanceOf(BaseRouteResolver);
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

    describe('resolve', () => {
      it('should be a function', () => {
        expect(instance.resolve).toBeInstanceOf(Function);
      });

      it('should return the render prop', () => {
        expect(instance.resolve()).toBe(renderRef);
      });
    });
  });
});