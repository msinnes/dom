import { abstract } from '@new-internal/oop';

import { BaseService } from './BaseService';

const removeAt = (arr, idx) => ([
  ...arr.slice(0, idx),
  ...arr.slice(idx + 1),
]);

const RemovableService = abstract(class extends BaseService {
  removeAt(idx) {
    this.indexes = removeAt(this.indexes, idx);
    this.entities = removeAt(this.entities, idx);
  }
});

export { RemovableService };
