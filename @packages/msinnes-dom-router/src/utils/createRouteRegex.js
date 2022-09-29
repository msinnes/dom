import {
  ANY_REGEX,

  createExact,
  normalize,
  createInexact,
} from './regex-utils';

const createRouteRegex = (path, exact = false) => {
  if (path === '*') return ANY_REGEX;

  const normalizedPath = normalize(path);
  let regexString;
  if (exact) regexString = createExact(normalizedPath);
  else regexString = createInexact(normalizedPath);
  return new RegExp(regexString);
};

export { createRouteRegex };