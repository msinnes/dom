export default (
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