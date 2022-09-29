import { AppComponent } from './abstract/AppComponent';

class ArrayComponent extends AppComponent {
  constructor(components) {
    super(components);
    this.components = components;
  }

  canUpdate(render) {
    return render.isArrayRender;
  }

  getNextChildren(appRender) {
    return appRender.render;
  }

  resolve() {
    return this.children.map(child => child.resolve());
  }

  render() {
    return this.components;
  }

  update(components) {
    this.components = components;
  }
}

export { ArrayComponent };