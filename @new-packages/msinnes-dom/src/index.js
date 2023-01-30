import { infra } from './infra';

const { useMemo, useState } = infra.hooks;

export { useMemo, useState };
export { BaseRenderableComponent as Component } from '@new-internal/base';
export { createElement, cloneElement } from '@new-internal/utils';
export { createRef } from './fns/refs';
