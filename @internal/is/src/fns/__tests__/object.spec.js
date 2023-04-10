import { isObjectLiteral } from '../object';

describe('isObjectLiteral', () => {
  it('should be a function', () => {
    expect(isObjectLiteral).toBeInstanceOf(Function);
  });

  it('should return true if an input is an object literal', () => {
    expect(isObjectLiteral({})).toBe(true);
    expect(isObjectLiteral({ field: 'data' })).toBe(true);
  });

  it('should return false if the input is not an object litera', () => {
    expect(isObjectLiteral(false)).toBe(false);
    expect(isObjectLiteral(1)).toBe(false);
    expect(isObjectLiteral('object literal')).toBe(false);
    expect(isObjectLiteral(() => {})).toBe(false);
    expect(isObjectLiteral(new Date())).toBe(false);
    expect(isObjectLiteral([])).toBe(false);
  });
});
