import { IdentitiveComponent } from './abstract/IdentitiveComponent';

class EmptyComponent extends IdentitiveComponent {
  constructor() {
    super();
  }

  canUpdate(render) {
    return render.isEmptyRender;
  }

  update() {}

  render() {
    return null;
  }
}

export { EmptyComponent };