import { abstract } from '@internal/oop/abstract';
import { abstractMethod } from '@internal/oop/abstractMethod';
import { getter } from '@internal/oop/getter';
import { isString } from '@internal/is/string';
import { isUndefined } from '@internal/is/undefined';
import { isNull } from '@internal/is/null';
import { isArray } from '@internal/is/array';
import { isFunction } from '@internal/is/function';
import { ArrayRender } from '@internal/render/ArrayRender';
import { EmptyRender } from '@internal/render/EmptyRender';
import { JSXRender } from '@internal/render/JSXRender';
import { StringRender } from '@internal/render/StringRender';

const warningMessage = 'ImplementationWarning: Function components must be executed and will not render to the DOM.';

const createPrivateRender = (render, instance) => {
  if (isFunction(render)) {
    console.warn(warningMessage);
    return new EmptyRender(null);
  }
  if (isString(render)) return new StringRender(render);
  if (isArray(render)) return new ArrayRender(instance.filterArrayChildren(render));
  if (isNull(render) || isUndefined(render)) return new EmptyRender(null);
  if (instance.validate(render)) return new JSXRender({ ...render, children: instance.filterArrayChildren(render.children) });
  return new StringRender(render.toString());
};

const BaseRender = abstract(class {
  constructor(render) {
    abstractMethod(this, 'validateSignature');
    abstractMethod(this, 'filterArrayChildren');
    const _render = createPrivateRender(render, this);
    getter(this, 'isStringRender', _render.isStringRender);
    getter(this, 'isArrayRender', _render.isArrayRender);
    getter(this, 'isEmptyRender', _render.isEmptyRender);
    getter(this, 'isJSXRender', _render.isJSXRender);
    this.render = _render.render;
  }

  validate(render = {}) {
    return this.validateSignature(render.signature)
      && this.validateProps(render.props)
      && this.validateChildren(render.children);
  }

  validateChildren(children = []) {
    return isArray(children);
  }

  validateProps(props = {}) {
    return (
      props instanceof Object &&
      !isArray(props) &&
      !(props instanceof Date) &&
      !(props instanceof Function)
    );
  }
});

export { createPrivateRender, BaseRender };
