import * as api from '..';

import { BaseRoute } from '../classes/BaseRoute';

describe('api', () => {
  it('should expose BaseRoute', () => {
    expect(api.BaseRoute).toBe(BaseRoute);
  });
});
