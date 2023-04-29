import { isDefined } from '@internal/is';

const parseConfig = ({ url, runExpiredTimers } = {}) => {
  const config = { dom: {}, time: {} };
  if (isDefined(url)) config.dom.url = url;
  if (isDefined(runExpiredTimers)) config.time.runExpiredTimers = runExpiredTimers;
  return config;
};

export { parseConfig };
