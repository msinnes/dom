import { isNull } from '../null';

describe('isNull', () => {
  it('should be a function', () => {
    expect(isNull).toBeInstanceOf(Function);
  });

  it('should return true for null', () => {
    expect(isNull(null)).toBe(true);
  });

  it('should return false for non null', () => {
    expect(isNull('')).toBe(false);
    expect(isNull(0)).toBe(false);
    expect(isNull({})).toBe(false);
    expect(isNull([])).toBe(false);
    expect(isNull(new Date())).toBe(false);
    expect(isNull(false)).toBe(false);
    expect(isNull()).toBe(false);
    expect(isNull(() => {})).toBe(false);
  });
});
