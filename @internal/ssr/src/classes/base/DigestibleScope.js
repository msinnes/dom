import { abstract, abstractMethod } from '@internal/oop';

import { Scope } from './Scope';

const DigestibleScope = abstract(class extends Scope {
  constructor() {
    super();
    abstractMethod(this, 'digest');
  }
});

export { DigestibleScope };
