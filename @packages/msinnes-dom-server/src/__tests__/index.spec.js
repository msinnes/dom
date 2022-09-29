import * as api from '../';
import { renderToString } from '../renderToString';

describe('renderToString', () => {
  it('should be a function', () => {
    expect(api.renderToString).toBeDefined();
    expect(api.renderToString).toBe(renderToString);
  });
});
