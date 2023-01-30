import * as api from '..';

import { Infra } from '../classes/Infra';

describe('api', () => {
  it('should expose the api', () => {
    expect(api.Infra).toBe(Infra);
  });
});
