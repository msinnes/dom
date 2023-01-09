import { BaseComponent } from './base/BaseComponent';

class ArrayComponent extends BaseComponent {
  constructor(components) {
    super();
    this.components = components;
  }

  canUpdate(render) {
    return render.isArrayRender;
  }

  render() {
    return this.components;
  }

  update(component) {
    this.components = component;
  }
}

export { ArrayComponent };