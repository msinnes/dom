import * as api from '..';

import { createRender } from '../fns/createRender';

describe('api', () => {
  it('should expose the api', () => {
    expect(api.createRender).toBe(createRender);
  });
});
