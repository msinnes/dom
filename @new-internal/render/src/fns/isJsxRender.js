import { DomRef } from '@new-internal/dom';

import {
  isFunction,
  isArray,
  isString,
  isEmptyString,
  isObjectLiteral,
} from '@new-internal/is';

const isJsxSignature = signature => isFunction(signature);

const isJsxProps = props => isObjectLiteral(props);

const isJsxChildren = children => isArray(children);

const isJsxRender = render => {
  if (isObjectLiteral(render)) {
    const { signature, props = {}, children = [] } = render;
    if (
      isJsxSignature(signature) &&
      isJsxProps(props) &&
      isJsxChildren(children)
    ) return true;
  }
  return false;
};

const isDomSignature = signature => (
  (isString(signature) && !isEmptyString(signature)) || signature instanceof DomRef
);

const isElementRender = render => {
  if (isObjectLiteral(render)) {
    const { signature, props = {}, children = [] } = render;
    if (
      isDomSignature(signature) &&
      isJsxProps(props) &&
      isJsxChildren(children)
    ) return true;
  }
  return false;
};

export { isJsxRender, isElementRender };