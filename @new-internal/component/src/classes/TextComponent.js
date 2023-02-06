import { TextNode } from '@new-internal/dom';

import { DomComponent } from './base/DomComponent';

class TextComponent extends DomComponent {
  isTextComponent = true;

  get text() {
    return this.elem.elem.textContent;
  }

  constructor(text) {
    super();
    this.elem = new TextNode(text);
  }

  canUpdate(render) {
    return render.isTextRender;
  }

  update(text) {
    this.elem.update(text);
  }

  render() {
    if (this.domParent) this.domParent.increment();
    return this.text;
  }
}

export { TextComponent };