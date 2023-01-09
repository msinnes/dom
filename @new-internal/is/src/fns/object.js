const isObjectLiteral = obj => {
  return (
    obj instanceof Object &&
    !(obj instanceof Function) &&
    !(obj instanceof Date) &&
    !Array.isArray(obj)
  );
};

export { isObjectLiteral };