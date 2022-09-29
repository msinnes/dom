import { BaseRouteResolver } from '../BaseRouteResolver';

describe('BaseRouteResolver', () => {
  it('should be a function', () => {
    expect(BaseRouteResolver).toBeInstanceOf(Function);
  });

  describe('instance', () => {
    let instance;
    beforeEach(() => {
      instance = new BaseRouteResolver('/path/');
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should have a regex props from createRouteRegex', () => {
      expect(instance.regex).toEqual(/^\/path\//);
    });

    it('should have a test function that executes the regex.test method', () => {
      const testMock = jest.fn(() => true);
      instance.regex.test = testMock;
      const tested = instance.test('string');
      expect(testMock).toHaveBeenCalledTimes(1);
      expect(testMock).toHaveBeenCalledWith('string');
      expect(tested).toBe(true);
    });
  });
});