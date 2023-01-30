import * as api from '..';

import { SsrScope } from '../classes/SsrScope';
import { parseConfig } from '../fns/parseConfig';

describe('api', () => {
  it('should expose the api', () => {
    expect(api.SsrScope).toBe(SsrScope);
    expect(api.parseConfig).toBe(parseConfig);
  });
});
