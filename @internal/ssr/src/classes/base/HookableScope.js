import { abstract } from '@internal/oop';

import { DigestibleScope } from './DigestibleScope';

const HookableScope = abstract(class extends DigestibleScope {
  hooks = [];

  hook(fn) {
    this.hooks.push(fn);
  }

  trigger() {
    this.hooks.forEach(hook => hook());
  }
});

export { HookableScope };
