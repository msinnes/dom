import * as api from '..';

import { renderToString } from '../fns/renderToString';

describe('api', () => {
  it('should expose the api', () => {
    expect(api.renderToString).toBe(renderToString);
  });
});
