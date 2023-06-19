import { BaseRoute } from '../BaseRoute';

class TestableBaseRoute extends BaseRoute {}

describe('BaseRoute', () => {
  it('should be a class', () => {
    expect(BaseRoute).toBeAClass();
  });

  it('should be abstract', () => {
    expect(BaseRoute).toBeAbstract();
  });

  describe('instance', () => {
    let instance;
    beforeEach(() => {
      instance = new TestableBaseRoute('/path/');
    });

    it('should have a regex props from createRouteRegex', () => {
      expect(instance.regex).toEqual(new RegExp('^\/path[\/]?'));
    });

    it('should expose the path on a path prop', () => {
      expect(instance.path).toEqual('/path/');
    });

    describe('getParams', () => {
      it('should be a function', () => {
        expect(instance.getParams).toBeInstanceOf(Function);
      });

      it('should return an empty object if the regex finds 0 matches', () => {
        instance = new TestableBaseRoute('/path', false, () => 'render');
        const params = instance.getParams('/param1/1/param2/2');
        expect(params).toBeDefined();
        expect(params).toBeInstanceOf(Object);
        expect(Object.keys(params).length).toEqual(0);
      });

      it('should return an empty object if no param is found', () => {
        instance = new TestableBaseRoute('/param1/1/param2/2', false, () => 'render');
        const params = instance.getParams('/param1/1/param2/2');
        expect(params).toBeDefined();
        expect(params).toBeInstanceOf(Object);
        expect(Object.keys(params).length).toEqual(0);
      });

      it('should resolve params if they are found', () => {
        instance = new TestableBaseRoute('/param1/:param1/param2/:param2');
        const params = instance.getParams('/param1/1/param2/2');
        expect(params).toBeDefined();
        expect(params).toBeInstanceOf(Object);
        expect(params).toMatchObject({
          param1: '1',
          param2: '2',
        });
      });
    });

    describe('test', () => {
      it('should be a function', () => {
        expect(instance.test).toBeInstanceOf(Function);
      });

      it('should execute the regex.test method', () => {
        const testMock = jest.fn(() => true);
        instance.regex.test = testMock;
        const tested = instance.test('string');
        expect(testMock).toHaveBeenCalledTimes(1);
        expect(testMock).toHaveBeenCalledWith('string');
        expect(tested).toBe(true);
      });
    });
  });
});
