import { createInfrastructure, contextController } from '../factories';

import * as api from '..';
import { ContextController } from '../ctx/ContextController';

describe('index', () => {
  it('should expose a createInfrastructure fn', () => {
    expect(api.createInfrastructure).toBeInstanceOf(Function);
    expect(api.createInfrastructure).toBe(createInfrastructure);
  });

  it('should expose a contextController', () => {
    expect(api.contextController).toBeDefined();
    expect(api.contextController).toBeInstanceOf(ContextController);
  });
});