import * as Dom from '@msinnes/dom';

import { BaseRenderableComponent } from '@internal/base';
import { DomRef } from '@internal/dom';
import { Infra } from '@internal/infra';

import { DomScope } from './DomScope';
import { InfraScope } from './InfraScope';

// this is found in the jsdom configuration docs.
const DEFAULT_JSDOM_URL = 'about:blank';

// TODO: move this to InfraScope to consolidate import
Dom.Component = BaseRenderableComponent;
Dom.createContext = defaultValue => Infra.contextService.createEntity(defaultValue);

class SsrScope {
  get services() {
    return this.infra.services;
  }

  get url() {
    const url = this.dom.dom.window.location.href;
    if (url === DEFAULT_JSDOM_URL) return;
    return url;
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
