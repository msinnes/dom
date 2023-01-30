import { Infra } from '@new-internal/infra';

import { infra } from '../infra';

describe('infra', () => {
  it('should be an instance of Infra', () => {
    expect(infra).toBeInstanceOf(Infra);
  });
});
