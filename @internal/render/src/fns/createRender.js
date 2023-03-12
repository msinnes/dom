import {
  isNull,
  isString,
  isEmptyString,
  isArray,
  isFunction,
  isUndefined,
} from '@internal/is';

import { EmptyRender } from '../classes/EmptyRender';
import { TextRender } from '../classes/TextRender';
import { ArrayRender } from '../classes/ArrayRender';
import { JSXRender } from '../classes/JSXRender';
import { ElementRender } from '../classes/ElementRender';

import { isJsxRender, isElementRender } from './isJsxRender';

const warningMessage = 'ImplementationWarning: Function components must be executed and will not render to the DOM.';

const createRender = render => {
  if (isUndefined(render) || isNull(render) || (isString(render) && isEmptyString(render))) return new EmptyRender(render);
  if (isString(render) && ! isEmptyString(render)) return new TextRender(render);
  if (isArray(render)) return new ArrayRender(render);
  if (isJsxRender(render)) return new JSXRender(render);
  if (isElementRender(render)) return new ElementRender(render);
  if (isFunction(render)) {
    console.warn(warningMessage);
    return new EmptyRender(null);
  }
  return new TextRender(render.toString());
};

export { createRender };
