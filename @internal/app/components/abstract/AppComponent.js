import { abstract } from '@internal/oop/abstract';
import { abstractMethod } from '@internal/oop/abstractMethod';
import { BaseComponent } from '@internal/base/BaseComponent';

const AppComponent = abstract(class AppComponent extends BaseComponent {
  constructor(signature, props = {}) {
    super();
    this.signature = signature;
    this.props = props;

    abstractMethod(this, 'render');
    abstractMethod(this, 'getNextChildren');
    abstractMethod(this, 'resolve');
  }
});

export { AppComponent };