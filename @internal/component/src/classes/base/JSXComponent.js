import { abstract } from '@internal/oop';

import { BaseComponent } from './BaseComponent';

const JSXComponent = abstract(class extends BaseComponent {
  isJSXComponent = true;

  constructor(signature, props) {
    super();
    this.signature = signature;
    this.props = props;
  }

  canUpdate({ signature }) {
    return !! signature && this.signature && signature === this.signature;
  }

  update(props) {
    this.props = props;
  }
});

export { JSXComponent };
