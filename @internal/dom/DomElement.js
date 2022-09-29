import { isString } from '@internal/is/string';
import { DomRef } from './DomRef';

const createElement = elem => isString(elem)
  ? new DomRef(elem) : elem;

class DomElement {
  get elem() {
    return this.ref.elem;
  }

  constructor(elem) {
    this.ref = createElement(elem);
    this.tag = this.elem.tagName.toLowerCase();
  }

  appendChild(elem) {
    this.elem.appendChild(elem.elem);
  }

  removeChild(elem) {
    this.elem.removeChild(elem.elem);
  }

  replaceChild(newChild, oldChild) {
    this.elem.replaceChild(newChild.elem, oldChild.elem);
  }

  update({ style, ...rest }) {
    Object.assign(this.elem.style, style);
    Object.assign(this.elem, rest);
  }
}

export { DomElement };
