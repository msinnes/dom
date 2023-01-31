import { BaseContext } from '@new-internal/base';

import { UserContext } from '../UserContext';

import { AppContext } from '../AppContext';

describe('AppContext', () => {
  it('should be a class', () => {
    expect(AppContext).toBeAClass();
  });

  it('should extends BaseContext', () => {
    expect(AppContext).toExtend(BaseContext);
  });

  describe('instance', () => {
    let instance;
    beforeEach(() => {
      instance = new AppContext();
    });

    it('should set a userContext prop', () => {
      expect(instance.userContext).toBeInstanceOf(UserContext);
    });
  });
});