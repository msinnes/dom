import { DomRef } from '@internal/dom/DomRef';
import { BaseRender } from '@internal/base/BaseRender';
import { isString, isEmpty } from '@internal/is/string';
import { isArray } from '@internal/is/array';

class AppRender extends BaseRender {
  filterArrayChildren(children = []) {
    return children.filter(c => (
      !(isString(c) && isEmpty(c)) && !(isArray(c) && !c.length)
    ));
  }

  getRenderableRender() {
    const { isJSXRender, render } = this;
    return isJSXRender ? new AppRender({
      signature: render.signature,
      props: {
        ...render.props,
        children: render.children
      }
    }) : this;
  }

  validateSignature(signature) {
    return (isString(signature) && !!signature.length) || signature instanceof DomRef || signature instanceof Function;
  }
}

export { AppRender };
