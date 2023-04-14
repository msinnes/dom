import { createElement, cloneElement } from '@internal/utils';
import { BaseRenderableComponent } from '@internal/base';

import * as api from '..';

import { createRef, useRef } from '../fns/refs';
import { createContext } from '../fns/ctx';
import { infra } from '../infra';

describe('api', () => {
  it('should expose the api', () => {
    expect(api.Component).toBe(BaseRenderableComponent);
    expect(api.createRef).toBe(createRef);
    expect(api.createContext).toBe(createContext);
    expect(api.createElement).toBe(createElement);
    expect(api.cloneElement).toBe(cloneElement);

    expect(api.useContext).toBe(infra.hooks.useContext);
    expect(api.useEffect).toBe(infra.hooks.useEffect);
    expect(api.useMemo).toBe(infra.hooks.useMemo);
    expect(api.useRef).toBe(useRef);
    expect(api.useState).toBe(infra.hooks.useState);
  });
});
