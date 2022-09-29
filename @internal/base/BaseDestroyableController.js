import { abstract } from '@internal/oop/abstract';

import { BaseController } from './BaseController';

const removeAt = (arr, idx) => ([
  ...arr.slice(0, idx),
  ...arr.slice(idx + 1),
]);

const BaseDestroyableController = abstract(class extends BaseController {
  removeAt(idx) {
    this.instances = removeAt(this.instances, idx);
    this.contexts = removeAt(this.contexts, idx);
  }
});

export { BaseDestroyableController };