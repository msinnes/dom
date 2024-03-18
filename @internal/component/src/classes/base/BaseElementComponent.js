import { abstract } from '@internal/oop';

import { DomComponent } from './DomComponent';

const BaseElementComponent = abstract(class extends DomComponent {
  isElementComponent = true;

  render() {
    super.render();
    const { children = [], ...renderProps } = this.props;
    this.elem.update(renderProps);
    return { signature: this.signature, props: renderProps, children };
  }
});

export { BaseElementComponent };
