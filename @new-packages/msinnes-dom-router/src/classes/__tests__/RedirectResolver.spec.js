import { BaseRoute } from '../BaseRoute';

import { RedirectResolver } from '../RedirectResolver';

describe('RedirectResolver', () => {
  it('should be a function', () => {
    expect(RedirectResolver).toBeAClass();
  });

  it('should extend BaseRoute', () => {
    expect(RedirectResolver).toExtend(BaseRoute);
  });

  describe('instance', () => {
    let instance;
    let toRef = jest.fn();
    beforeEach(() => {
      instance = new RedirectResolver('/path/', false, toRef);
    });

    it('should have a to prop that is equal to the input to', () => {
      expect(instance.to).toBe(toRef);
    });

    describe('resolve', () => {
      it('should be a function', () => {
        expect(instance.resolve).toBeInstanceOf(Function);
      });

      it('should navigate to the to destination and return null', () => {
        expect(instance.resolve()).toBe(toRef);
      });
    });
  });
});
