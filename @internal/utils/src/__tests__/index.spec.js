import * as api from '..';
import { cloneElement } from '../fns/cloneElement';
import { createElement } from '../fns/createElement';

describe('api', () => {
  it('should expose the api', () => {
    expect(api.cloneElement).toBe(cloneElement);
    expect(api.createElement).toBe(createElement);
  });
});
