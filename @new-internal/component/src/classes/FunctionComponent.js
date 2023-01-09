import { JSXComponent } from './base/JSXComponent';

class FunctionComponent extends JSXComponent {
  render() {
    return [this.signature(this.props)];
  }
}

export { FunctionComponent };