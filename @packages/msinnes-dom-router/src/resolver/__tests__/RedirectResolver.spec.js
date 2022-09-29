/**
 * @jest-environment jsdom
 */
import { BaseRouteResolver } from '../BaseRouteResolver';
import { RedirectResolver } from '../RedirectResolver';

describe('RedirectResolver', () => {
  it('should be a function', () => {
    expect(RedirectResolver).toBeInstanceOf(Function);
  });

  describe('instance', () => {
    let instance;
    let toRef = jest.fn();
    beforeEach(() => {
      instance = new RedirectResolver('/path/', false, toRef);
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

    it('should have a to prop that is equal to the input to', () => {
      expect(instance.to).toBe(toRef);
    });

    describe('resolve', () => {
      it('should be a function', () => {
        expect(instance.resolve).toBeInstanceOf(Function);
      });

      it('should navigate to the to destination and return null', () => {
        expect(instance.resolve()).toBe(null);
        expect(toRef).toHaveBeenCalled();
      });
    });
  });
});