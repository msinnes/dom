import { BaseRender } from '@internal/base/BaseRender';
import { isString, isEmpty } from '@internal/is/string';
import { isUndefined } from '@internal/is/undefined';
import { isNull } from '@internal/is/null';
import { isArray } from '@internal/is/array';

import { DomRef } from './DomRef';

class DomRender extends BaseRender {
  filterArrayChildren(children = []) {
    return children.filter(child => (
      !(isString(child) && isEmpty(child)) &&
      !(isArray(child) && !child.length) &&
      !(isNull(child)) &&
      !(isUndefined(child))
    ));
  }

  validateSignature(signature) {
    return (isString(signature) && !isEmpty(signature)) || signature instanceof DomRef;
  }
}

export { DomRender };
