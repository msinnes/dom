import { BaseComponent } from './base/BaseComponent';

class EmptyComponent extends BaseComponent {
  canUpdate(render) {
    return render.isEmptyRender;
  }

  render() {}

  update() {}
}

export { EmptyComponent };
