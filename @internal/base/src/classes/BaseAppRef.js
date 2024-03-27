import { DomRef } from '@internal/dom';
import { abstract } from '@internal/oop';

function emptyElementChildren(elem) {
  while(elem.firstChild) {
    elem.removeChild(elem.firstChild);
  }
}

const BaseAppRef = abstract(class extends DomRef {
  constructor(ref) {
    super(ref);

    let controller = null;
    this.hydrate = render => {
      emptyElementChildren(this.elem);
      controller = this.create(render);
      controller.render();
      return this;
    };

    this.render = render => {
      if (controller) controller.unmount();
      controller = this.create(render);
      controller.render();
      return this;
    };

    this.unmount = () => {
      if (controller) controller.unmount();
      controller = null;
      return this;
    };
  }
});

export { BaseAppRef };
