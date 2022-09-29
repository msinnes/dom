import { BaseComponent } from '@internal/base/BaseComponent';
import { isString } from '@internal/is/string';
import { DomElement } from './DomElement';

const arrayComponent = child => child instanceof ArrayComponent;
const notAnArrayComponent = child => (!arrayComponent(child));

class BaseDomNode extends BaseComponent {
  appendChild(child) {
    super.appendChild(child);
    notAnArrayComponent(child) && this.elem.appendChild(child.elem);
  }

  removeChild(child) {
    super.removeChild(child);
    notAnArrayComponent(child) && this.elem.removeChild(child.elem);
  }

  replaceChild(newChild, oldChild) {
    super.replaceChild(newChild, oldChild);
    if (notAnArrayComponent(newChild) && notAnArrayComponent(oldChild)) this.elem.replaceChild(newChild.elem, oldChild.elem);
    else if (arrayComponent(oldChild) && notAnArrayComponent(newChild)) {
      oldChild.unmountChildren();
      this.elem.appendChild(newChild.elem);
    }
    else if (arrayComponent(newChild) && notAnArrayComponent(oldChild)) this.elem.removeChild(oldChild.elem);
  }
}

class ArrayComponent extends BaseDomNode {
  get elem() {
    return this.parent.elem;
  }

  constructor(elems) {
    super();
    this.elems = elems;
  }

  canUpdate(render) {
    return render.isArrayRender;
  }

  update(elems = []) {
    this.elems = elems;
  }
}

class StringComponent extends BaseDomNode {
  constructor(text) {
    super();
    this.text = text;
    this.elem = { elem: document.createTextNode(text) };
  }

  canUpdate(render) {
    return render.isStringRender;
  }

  update(text) {
    this.elem.elem.textContent = text;
  }
}

class DomComponent extends BaseDomNode {
  get tag() {
    return this.elem.tag;
  }

  constructor({ signature: elem, props } = {}) {
    super();
    this.elem = new DomElement(elem);
    props && this.update(props);
  }

  canUpdate({ render }) {
    let { signature } = render;
    if (!signature) return false;
    const tag = isString(signature) ? signature : signature.elem.tagName.toLowerCase();
    return tag === this.tag;
  }

  update(props = {}) {
    this.elem.update(props);
  }
}

export { ArrayComponent, DomComponent, StringComponent };
