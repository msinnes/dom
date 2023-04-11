import * as api from '..';

import { renderToScreen, renderToString } from '../fns/renderers';

describe('api', () => {
  it('should expose the api', () => {
    expect(api.renderToScreen).toBe(renderToScreen);
    expect(api.renderToString).toBe(renderToString);
  });
});
