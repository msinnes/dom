import { createElement, cloneElement } from '@new-internal/utils';
import { BaseRenderableComponent } from '@new-internal/base';

import * as api from '..';

import { createRef } from '../fns/refs';
import { infra } from '../infra';

describe('api', () => {
  it('should expose the api', () => {
    expect(api.Component).toBe(BaseRenderableComponent);
    expect(api.createRef).toBe(createRef);
    expect(api.createElement).toBe(createElement);
    expect(api.cloneElement).toBe(cloneElement);

    expect(api.useMemo).toBe(infra.hooks.useMemo);
    expect(api.useState).toBe(infra.hooks.useState);
  });
});