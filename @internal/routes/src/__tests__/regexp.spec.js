import { constants, utils } from '../regexp';

describe('constants', () => {
  const {
    // constants
    ESCAPED_SLASH,
    CARAT,
    DS,
    // constant regular expressions
    ANY_REGEX,
    STARTS_WITH_SLASH,
    ENDS_WITH_SLASH,
  } = constants;
  it('should expose the correct constants', () => {
    expect(ESCAPED_SLASH).toEqual('\/');
    expect(CARAT).toEqual('^');
    expect(DS).toEqual('$');
  });

  it('should expose an any regex', () => {
    expect(ANY_REGEX).toBeInstanceOf(RegExp);
    expect(ANY_REGEX).toEqual(/.*/);
  });

  it('should expose a startWithSlash', () => {
    expect(STARTS_WITH_SLASH).toBeInstanceOf(RegExp);
    expect(STARTS_WITH_SLASH).toEqual(/^\//);
  });

  it('should expose an endsWithSlash', () => {
    expect(ENDS_WITH_SLASH).toBeInstanceOf(RegExp);
    expect(ENDS_WITH_SLASH).toEqual(/\/$/);
  });
});

describe('utils', () => {
  const {
    // regex string builders
    createStartsWith,
    createEndsWith,
    createExact,
    normalize,
    createInexact,
    // util-fns
    createRouteRegex,
    getParams,
  } = utils;
  describe('createStartsWith', () => {
    it('should be a function', () => {
      expect(createStartsWith).toBeInstanceOf(Function);
    });

    it('should return a startWith string', () => {
      const string = createStartsWith('string');
      expect(string).toEqual('^string');
    });
  });

  describe('createEndsWith', () => {
    it('should be a function', () => {
      expect(createEndsWith).toBeInstanceOf(Function);
    });

    it('should return an endsWith string', () => {
      const string = createEndsWith('string');
      expect(string).toEqual('string$');
    });
  });

  describe('createExact', () => {
    it('should be a function', () => {
      expect(createExact).toBeInstanceOf(Function);
    });

    it('should return an exact string', () => {
      const string = createExact('string');
      expect(string).toEqual('^string$');
    });
  });

  describe('normalize', () => {
    it('should be a function', () => {
      expect(normalize).toBeInstanceOf(Function);
    });

    it('should escape all slashes', () => {
      const string = normalize('/string/');
      expect(string).toEqual('\/string\/');
    });

    it('should prepend a \'/\' character if one is not passed', () => {
      const string = normalize('string');
      expect(string).toEqual('\/string');
    });

    it('should replace path params with wildcard captures', () => {
      let string = normalize('/:string');
      expect(string).toEqual('\/(.+)');
      string = normalize('/:string/');
      expect(string).toEqual('\/(.+)\/');
    });
  });

  describe('createInexact', () => {
    it('should be a function', () => {
      expect(createInexact).toBeInstanceOf(Function);
    });

    it('should return a starts with string and swap this ending slash for an optional slash if the route ends with \'/\'', () => {
      let string = createInexact('route/');
      expect(string).toEqual('^route[\/]?');
      string = createInexact('route\/');
      expect(string).toEqual('^route[\/]?');
    });

    it('should return a starts with and append an optional \'/\/ if the string does not end with a slash', () => {
      let string = createInexact('string');
      expect(string).toEqual('^string[\/]?');
    });
  });

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

  describe('getParams', () => {
    it('should be a function', () => {
      expect(getParams).toBeInstanceOf(Function);
    });

    it('should return an empty object if the regex finds 0 matches', () => {
      const params = getParams(createRouteRegex('/path'), '/path', '/param1/1/param2/2');
      expect(params).toBeDefined();
      expect(params).toBeInstanceOf(Object);
      expect(Object.keys(params).length).toEqual(0);
    });

    it('should return an empty object if no param is found', () => {
      const params = getParams(createRouteRegex('/param1/1/param2/2', false), '/param1/1/param2/2', '/param1/1/param2/2');
      expect(params).toBeDefined();
      expect(params).toBeInstanceOf(Object);
      expect(Object.keys(params).length).toEqual(0);
    });

    it('should resolve params if they are found', () => {
      const params = getParams(createRouteRegex('/param1/:param1/param2/:param2', false), '/param1/:param1/param2/:param2', '/param1/1/param2/2');
      expect(params).toBeDefined();
      expect(params).toBeInstanceOf(Object);
      expect(params).toMatchObject({
        param1: '1',
        param2: '2',
      });
    });
  });
});
