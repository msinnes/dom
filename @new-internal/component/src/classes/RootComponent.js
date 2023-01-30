import { RootNode } from '@new-internal/dom';

import { DomComponent } from './base/DomComponent';

class RootComponent extends DomComponent {
  isRootComponent = true;

  constructor(root, elem) {
    super();
    this.root = root;
    this.elem = new RootNode(elem);
  }

  render() {
    super.render(this.elem);
    return this.root;
  }
}

export { RootComponent };