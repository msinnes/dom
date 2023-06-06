import * as api from '..';

import { renderToScreen, renderToString, renderToScreenAsync, renderToStringAsync } from '../fns/renderers';

describe('api', () => {
  it('should expose the api', () => {
    expect(api.renderToScreen).toBe(renderToScreen);
    expect(api.renderToString).toBe(renderToString);
    expect(api.renderToScreenAsync).toBe(renderToScreenAsync);
    expect(api.renderToStringAsync).toBe(renderToStringAsync);
  });
});
