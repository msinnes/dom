import { isArray } from '../array';

describe('isArray', () => {
  it('should be a function', () => {
    expect(isArray).toBeInstanceOf(Function);
  });

  it('should be Array.isArray', () => {
    expect(isArray).toBe(Array.isArray);
  });
});
