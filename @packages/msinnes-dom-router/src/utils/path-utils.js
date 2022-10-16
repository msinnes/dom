export const getParams = (regex, path, loc) => {
  const foundKeys = path.match(regex);
  const foundValues = loc.match(regex);
  if (foundKeys && foundValues && foundKeys.length === foundValues.length) {
    const keys = foundKeys.slice(1);
    const values = foundValues.slice(1);
    return Object.fromEntries(keys.map((key, index) => ([key.slice(1), values[index]])));
  }
  return {};
};