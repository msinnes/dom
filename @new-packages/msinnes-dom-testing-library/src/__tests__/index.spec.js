import * as api from '..';

import { render } from '../fns/render';

describe('api', () => {
  it('should expose the api', () => {
    expect(api.render).toBe(render);
  });
});
