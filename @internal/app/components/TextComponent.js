import { IdentitiveComponent } from './abstract/IdentitiveComponent';

class TextComponent extends IdentitiveComponent {
  constructor(text) {
    super(text);
    this.text = text;
  }

  canUpdate(render) {
    return render.isStringRender;
  }

  update(text) {
    this.text = text;
  }

  render() {
    return this.text;
  }
}

export { TextComponent };