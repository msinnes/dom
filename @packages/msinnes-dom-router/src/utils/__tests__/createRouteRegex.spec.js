import { createRouteRegex } from '../createRouteRegex';

describe('createRouteRegex', () => {
  it('should be a function', () => {
    expect(createRouteRegex).toBeInstanceOf(Function);
  });

  it('should generate a wildcard regex', () => {
    const regex = createRouteRegex('*');
    expect(regex.test('anything')).toBe(true);
  });

  it('should append a \'/\' character perform a startWith query', () => {
    let regex = createRouteRegex('/route');
    expect(regex.test('/route')).toBe(true);
    expect(regex.test('/route/')).toBe(true);
    expect(regex.test('/route/anything')).toBe(true);

    regex = createRouteRegex('/route/');
    expect(regex.test('/route')).toBe(true);
    expect(regex.test('/route/')).toBe(true);
    expect(regex.test('/route/anything')).toBe(true);
  });

  it('should prepend a \'/\' character if one is not passed', () => {
    let regex = createRouteRegex('route');
    expect('/route');
    expect(regex.test('/route')).toBe(true);
    expect(regex.test('/route/')).toBe(true);
    expect(regex.test('/route/anything')).toBe(true);

    regex = createRouteRegex('route/');
    expect(regex.test('/route')).toBe(true);
    expect(regex.test('/route/')).toBe(true);
    expect(regex.test('/route/anything')).toBe(true);
  });

  it('should return an exact matcher if an exact prop is passed', () => {
    const regex = createRouteRegex('/exact', true);
    expect(regex.test('/exact')).toBe(true);
    expect(regex.test('/exact/')).toBe(false);
    expect(regex.test('/exact/anything')).toBe(false);
    expect(regex.test('/exact anything')).toBe(false);
  });
});