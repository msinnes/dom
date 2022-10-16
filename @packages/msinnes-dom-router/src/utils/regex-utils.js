export const ESCAPED_SLASH = '\/';
export const CARAT = '^';
export const DS = '$';
export const PIPE = '|';

export const ANY_REGEX = /.*/;

export const createStartsWith = path => CARAT + path;
export const createExact = path => CARAT + path + DS;
export const createEndsWith = path => path + DS;
export const createOr = (left, right) => left + PIPE + right;

export const STARTS_WITH_SLASH = new RegExp(createStartsWith(ESCAPED_SLASH));
export const ENDS_WITH_SLASH = new RegExp(createEndsWith(ESCAPED_SLASH));

export const normalize = path => (STARTS_WITH_SLASH.test(path) ? path : ESCAPED_SLASH + path).replace('/', '\/').replace(/:[a-zA-Z1-9]+/g, '(.+)');
export const createInexact = path => createStartsWith(
  (ENDS_WITH_SLASH.test(path) ? path.substring(0, path.length - 1) : path) + '[\/]?'
);

export const createRouteRegex = (path, exact = false) => {
  if (path === '*') return ANY_REGEX;
  const normalizedPath = normalize(path);

  let regexString;
  if (exact) regexString = createExact(normalizedPath);
  else regexString = createInexact(normalizedPath);
  return new RegExp(regexString);
};

export const createBaseRouteRegex = path => createRouteRegex(path);
