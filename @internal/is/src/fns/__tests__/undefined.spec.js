import { isDefined, isUndefined } from '../undefined';

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
    expect(isUndefined(true)).toBe(false);
    expect(isUndefined(false)).toBe(false);
    expect(isUndefined(null)).toBe(false);
    expect(isUndefined(() => {})).toBe(false);
  });
});

describe('isDefined', () => {
  it('should be a function', () => {
    expect(isDefined).toBeInstanceOf(Function);
  });

  it('should return true for defined values', () => {
    expect(isDefined('')).toBe(true);
    expect(isDefined(0)).toBe(true);
    expect(isDefined({})).toBe(true);
    expect(isDefined([])).toBe(true);
    expect(isDefined(new Date())).toBe(true);
    expect(isDefined(true)).toBe(true);
    expect(isDefined(false)).toBe(true);
    expect(isDefined(null)).toBe(true);
    expect(isDefined(() => {})).toBe(true);
  });

  it('should return false for undefined', () => {
    expect(isDefined()).toBe(false);
    expect(isDefined(undefined)).toBe(false);
  });
});
