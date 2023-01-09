export const createElement = (signature, props, children) => {
  return {
    signature: signature,
    props: props || {},
    children: children || [],
  };
};
