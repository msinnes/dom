import { AppRef } from '../../classes/AppRef';

import { createRef } from '../refs';

describe('createRef', () => {
  it('should be a function', () => {
    expect(createRef).toBeInstanceOf(Function);
  });

  it('should return an instance of AppRef', () => {
    const bodyRef = {};
    const ref = createRef(bodyRef);
    expect(ref).toBeInstanceOf(AppRef);
    expect(ref.elem).toBe(bodyRef);
  });
});