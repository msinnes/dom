import * as api from '..';

import { isArray } from '../fns/array';
import { isFunction } from '../fns/function';
import { isNull } from '../fns/null';
import { isObjectLiteral } from '../fns/object';
import { isString, isEmptyString } from '../fns/string';
import { isUndefined } from '../fns/undefined';

describe('api', () => {
  it('should expose the api', () => {
    expect(api.isArray).toBe(isArray);
    expect(api.isArray).toBeInstanceOf(Function);
    expect(api.isFunction).toBe(isFunction);
    expect(api.isNull).toBe(isNull);
    expect(api.isObjectLiteral).toBe(isObjectLiteral);
    expect(api.isString).toBe(isString);
    expect(api.isEmptyString).toBe(isEmptyString);
    expect(api.isUndefined).toBe(isUndefined);
  });
});