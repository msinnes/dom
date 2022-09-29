import { isFunction } from '../function';

describe('isFunction', () => {
  it('should be a function', () => {
    expect(isFunction).toBeInstanceOf(Function);
  });

  it('should return true for a function', () => {
    expect(isFunction(() => {})).toBe(true);
    expect(isFunction(function() {})).toBe(true);
    expect(isFunction(new Function)).toBe(true);
  });

  it('should return false for non functions', () => {
    expect(isFunction('')).toBe(false);
    expect(isFunction(0)).toBe(false);
    expect(isFunction({})).toBe(false);
    expect(isFunction([])).toBe(false);
    expect(isFunction(new Date())).toBe(false);
    expect(isFunction(false)).toBe(false);
    expect(isFunction()).toBe(false);
    expect(isFunction(null)).toBe(false);
  });
});