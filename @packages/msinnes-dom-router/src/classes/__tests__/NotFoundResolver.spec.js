import { BaseRoute } from '@internal/routes';

import { NotFoundResolver } from '../NotFoundResolver';

describe('NotFoundResolver', () => {
  it('should be a class', () => {
    expect(NotFoundResolver).toBeAClass();
  });

  it('should extend BaseRoute', () => {
    expect(NotFoundResolver).toExtend(BaseRoute);
  });

  describe('instance', () => {
    let instance;
    beforeEach(() => {
      instance = new NotFoundResolver();
    });

    it('should set path to *', () => {
      expect(instance.path).toEqual('*');
    });

    describe('resolve', () => {
      it('should be a function', () => {
        expect(instance.resolve).toBeInstanceOf(Function);
      });

      it('should throw an error', () => {
        expect(() => {
          instance.resolve();
        }).toThrow('404 Not Found');
      });
    });
  });
});
