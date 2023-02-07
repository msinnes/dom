import { isString, isEmptyString } from '../string';

describe('isString', () => {
  it('should be a function', () => {
    expect(isString).toBeInstanceOf(Function);
  });

  it('should return true for strings', () => {
    const string = 'string';
    const emptyString = '';
    const stringLiteral = `
      string
      literal
    `;
    expect(isString(string)).toBe(true);
    expect(isString(emptyString)).toBe(true);
    expect(isString(stringLiteral)).toBe(true);
  });

  it('should return false for non strings', () => {
    expect(isString(0)).toBe(false);
    expect(isString({})).toBe(false);
    expect(isString([])).toBe(false);
    expect(isString(new Date())).toBe(false);
    expect(isString(false)).toBe(false);
    expect(isString()).toBe(false);
    expect(isString(null)).toBe(false);
    expect(isString(() => {})).toBe(false);
  });
});

describe('isEmptyString', () => {
  it('should be a function', () => {
    expect(isEmptyString).toBeInstanceOf(Function);
  });

  it('should return true for empty string, include whitespace only strings', () => {
    const emptyString = '';
    const spacesString = '   ';
    const emptyStringLiteral = `

    `;
    expect(isEmptyString(emptyString)).toBe(true);
    expect(isEmptyString(spacesString)).toBe(true);
    expect(isEmptyString(emptyStringLiteral)).toBe(true);
  });

  it('should return false for non-empty strings', () => {
    const string = 'string';
    const stringLiteral = `
      string
      literal
    `;
    expect(isEmptyString(string)).toBe(false);
    expect(isEmptyString(stringLiteral)).toBe(false);
  });
});
