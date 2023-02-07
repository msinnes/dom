import { Infra } from '@internal/infra';

import { infra } from '../infra';

describe('infra', () => {
  it('should be an instance of Infra', () => {
    expect(infra).toBeInstanceOf(Infra);
  });
});
