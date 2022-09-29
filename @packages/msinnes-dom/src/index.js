import { DomRef } from '@internal/dom/DomRef';
import { RenderableComponent as Component } from '@internal/app/AppRenderer';
import { isEmpty, isString } from '@internal/is/string';
import { isUndefined } from '@internal/is/undefined';
import { isNull } from '@internal/is/null';
import cloneElement from '@internal/utils/cloneElement';
import createElement from '@internal/utils/createElement';

import { renderApp as mainRenderApp, hydrateApp as mainHydrateApp } from './main';
import { services, hooks } from './infra';
const { useContext, useEffect, useMemo, useState } = hooks;

const createRef = elem => new DomRef(elem);
const createContext = defaultValue => services.createApiContext(defaultValue);

// TODO: it should happen in window.onload
const renderApp = (render, anchor) => {
  mainRenderApp(render, anchor);
};

// TODO: it should happen in window.onload
const hydrateApp = (render, anchor) => {
  mainHydrateApp(render, anchor);
};

export { renderApp, hydrateApp, createContext, createRef, Component };
export { useContext, useEffect, useMemo, useState };
export { createElement, cloneElement };