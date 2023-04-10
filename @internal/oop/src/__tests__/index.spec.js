import * as api from '..';

import { abstract } from '../fns/abstract';
import { abstractMethod } from '../fns/abstractMethod';
import { extendz } from '../fns/extendz';

describe('api', () => {
  it('should expose abstract', () => {
    expect(api.abstract).toBe(abstract);
    expect(api.abstractMethod).toBe(abstractMethod);
    expect(api.extendz).toBe(extendz);
  });
});
