const cloneElement = (
  { signature, props = {}, children },
  nextProps = {},
  nextChildren,
) => {
  return {
    signature,
    props: {
      ...props,
      ...nextProps,
    },
    children: nextChildren || children || [],
  };
};

export { cloneElement };
