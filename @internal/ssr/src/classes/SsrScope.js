import * as Dom from '@new-msinnes/dom';

import { BaseRenderableComponent } from '@internal/base';
import { DomRef } from '@internal/dom';
import { Infra } from '@internal/infra';

import { DomScope } from './DomScope';
import { InfraScope } from './InfraScope';

Dom.Component = BaseRenderableComponent;
Dom.createContext = defaultValue => Infra.contextService.createEntity(defaultValue);

class SsrScope {
  get services() {
    return this.infra.services;
  }

  constructor(config) {
    this.dom = new DomScope(config.dom);
    this.body = new DomRef(this.dom.dom.window.document.body);
    this.infra = new InfraScope(new Infra());
  }

  enable() {
    this.dom.enable();
    this.infra.enable();
  }

  disable() {
    this.dom.disable();
    this.infra.disable();
  }
}

export { SsrScope };
