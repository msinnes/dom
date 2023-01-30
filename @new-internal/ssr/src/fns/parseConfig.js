const parseConfig = ({ url } = {}) => {
  const config = { dom: {} };
  if (url) config.dom.url = url;
  return config;
}

export { parseConfig };
