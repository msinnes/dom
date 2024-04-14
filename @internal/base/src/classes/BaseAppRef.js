import { DomRef } from '@internal/dom';
import { abstract } from '@internal/oop';

function emptyElementChildren(elem) {
  while(elem.firstChild) {
    elem.removeChild(elem.firstChild);
  }
}

// TODO: onError will call this.unmount and then this.create with the error text
// TODO: add onError onto the services object
const BaseAppRef = abstract(class extends DomRef {
  constructor(ref, create) {
    super(ref);

    let controller = null;
    this.hydrate = render => {
      emptyElementChildren(this.elem);
      controller = create(render);
      controller.render();
      return this;
    };

    this.render = render => {
      if (controller) controller.unmount();
      controller = create(render);
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
