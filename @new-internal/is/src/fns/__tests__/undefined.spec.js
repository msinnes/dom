import { isUndefined } from '../undefined';

describe('isUndefined', () => {
  it('should be a function', () => {
    expect(isUndefined).toBeInstanceOf(Function);
  });

  it('should return true for undefined', () => {
    expect(isUndefined()).toBe(true);
    expect(isUndefined(undefined)).toBe(true);
  });

  it('should return false for anything defined', () => {
    expect(isUndefined('')).toBe(false);
    expect(isUndefined(0)).toBe(false);
    expect(isUndefined({})).toBe(false);
    expect(isUndefined([])).toBe(false);
    expect(isUndefined(new Date())).toBe(false);
    expect(isUndefined(false)).toBe(false);
    expect(isUndefined(null)).toBe(false);
    expect(isUndefined(() => {})).toBe(false);
  });
});