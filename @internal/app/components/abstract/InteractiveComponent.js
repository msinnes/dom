import { abstract } from '@internal/oop/abstract';
import { abstractMethod } from '@internal/oop/abstractMethod';

import { SignatureComponent } from './SignatureComponent';

const InteractiveComponent = abstract(class extends  SignatureComponent {
  constructor(signature, props) {
    super(signature, props);

    abstractMethod(this, 'writeState');
  }

  getNextChildren(appRender) {
    return [appRender.render];
  }

  resolve() {
    return this.firstChild.resolve();
  }
});

export { InteractiveComponent };