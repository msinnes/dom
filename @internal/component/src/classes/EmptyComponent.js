import { BaseComponent } from './base/BaseComponent';

class EmptyComponent extends BaseComponent {
  isEmptyComponent = true;

  canUpdate(render) {
    return render.isEmptyRender;
  }

  render() {}

  update() {}
}

export { EmptyComponent };
