import { isString, isEmpty } from '../string';

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

describe('isEmpty', () => {
  it('should be a function', () => {
    expect(isEmpty).toBeInstanceOf(Function);
  });

  it('should return true for empty string, include whitespace only strings', () => {
    const emptyString = '';
    const spacesString = '   ';
    const emptyStringLiteral = `

    `;
    expect(isEmpty(emptyString)).toBe(true);
    expect(isEmpty(spacesString)).toBe(true);
    expect(isEmpty(emptyStringLiteral)).toBe(true);
  });

  it('should return false for non-empty strings', () => {
    const string = 'string';
    const stringLiteral = `
      string
      literal
    `;
    expect(isEmpty(string)).toBe(false);
    expect(isEmpty(stringLiteral)).toBe(false);
  });
});
