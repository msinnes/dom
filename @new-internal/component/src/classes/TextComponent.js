import { TextNode } from '@new-internal/dom';

import { DomComponent } from './base/DomComponent';

class TextComponent extends DomComponent {
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
    super.render();
    return this.text;
  }
}

export { TextComponent };