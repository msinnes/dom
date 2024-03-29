const ESCAPED_SLASH = '\/';
const CARAT = '^';
const DS = '$';

const ANY_REGEX = /.*/;

const createStartsWith = path => CARAT + path;
const createExact = path => CARAT + path + DS;
const createEndsWith = path => path + DS;

const STARTS_WITH_SLASH = new RegExp(createStartsWith(ESCAPED_SLASH));
const ENDS_WITH_SLASH = new RegExp(createEndsWith(ESCAPED_SLASH));

const normalize = path => (STARTS_WITH_SLASH.test(path) ? path : ESCAPED_SLASH + path).replace('/', '\/').replace(/:[a-zA-Z1-9]+/g, '(.+)');
const createInexact = path => createStartsWith(
  (ENDS_WITH_SLASH.test(path) ? path.substring(0, path.length - 1) : path) + '[\/]?'
);

const createRouteRegex = (path, exact = false) => {
  if (path === '*') return ANY_REGEX;
  const normalizedPath = normalize(path);

  let regexString;
  if (exact) regexString = createExact(normalizedPath);
  else regexString = createInexact(normalizedPath);
  return new RegExp(regexString);
};

const getParams = (regex, path, loc) => {
  const foundKeys = path.match(regex);
  const foundValues = loc.match(regex);
  if (foundKeys && foundValues && foundKeys.length === foundValues.length) {
    const keys = foundKeys.slice(1);
    const values = foundValues.slice(1);
    return Object.fromEntries(keys.map((key, index) => ([key.slice(1), values[index]])));
  }
  return {};
};

const constants = {
  // constants
  ESCAPED_SLASH,
  CARAT,
  DS,
  // constant regular expressions
  ANY_REGEX,
  STARTS_WITH_SLASH,
  ENDS_WITH_SLASH,
};

const utils = {
  // regex string builders
  createStartsWith,
  createEndsWith,
  createExact,
  normalize,
  createInexact,
  // util-fns
  createRouteRegex,
  getParams,
};

export { constants, utils };
