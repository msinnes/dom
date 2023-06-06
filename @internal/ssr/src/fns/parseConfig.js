import { isDefined, isFunction } from '@internal/is';

const parseConfig = ({ url, digestExpiredTimers, digestFetch, fetch } = {}) => {
  const config = { dom: {}, time: {}, fetch: {} };
  if (isDefined(url)) config.dom.url = url;
  if (isDefined(digestExpiredTimers)) config.time.digestExpiredTimers = digestExpiredTimers;
  if (isDefined(digestFetch)) config.fetch.digestFetch = digestFetch;
  if (isDefined(fetch) && isFunction(fetch)) config.fetch.fetch = fetch;
  return config;
};

export { parseConfig };
