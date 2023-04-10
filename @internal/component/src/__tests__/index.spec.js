import * as api from '..';

import { createComponentFactory } from '../fns/createComponentFactory';
import { createRootComponent } from '../fns/createRootComponent';

describe('index', () => {
  it('should expose the api', () => {
    expect(api.createComponentFactory).toBe(createComponentFactory);
    expect(api.createRootComponent).toBe(createRootComponent);
  });
});
