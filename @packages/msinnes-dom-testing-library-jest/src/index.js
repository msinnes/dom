if (!expect) throw new Error('@msinnes/dom-testing-library-jest can only execute within a jest context');

const traverse = (node, cb) => {
  if (!node || !cb) return;
  cb(node);
  if (node.children && node.children.length) {
    const len = node.children.length;
    let i = 0;
    for (; i < len; i++) {
      traverse(node.children[i], cb);
    }
  }
};

const checkScreen = (nodeOrNodes, screen) => {
  const nodes = Array.isArray(nodeOrNodes) ? nodeOrNodes : [nodeOrNodes];
  if (!nodes.length) return false;
  const validArray = new Array(nodes.length).fill(false);
  traverse(screen.container, node => {
    const idx = nodes.indexOf(node);
    if (idx >= 0) validArray[idx] = true;
  });
  return validArray.reduce((acc, item) => {
    if (!acc || !item) return false;
    return true;
  }, true);
};

const checkAttr = (node, attr, value) => node[attr] === value;
const checkAttrs = (node, obj) => {
  const attrs = Object.keys(obj);
  if (!attrs.length) return false;
  return attrs.reduce((acc, item) => {
    if (checkAttr(node, item, obj[item])) return acc;
    return false;
  }, true);
};

expect.extend({
  toBeOn: (node, screen) => ({
    pass: checkScreen(node, screen),
    message: () => 'expected input or inputs to be on the screen',
  }),
  toHaveAttribute: (node, attr, value) => ({
    pass: checkAttr(node, attr, value),
    message: () => `expected input to have attribute ${attr} with value ${value}`,
  }),
  toHaveAttributes: (node, obj) => ({
    pass: checkAttrs(node, obj),
    message: () => `expected input to have attributes ${JSON.stringify(obj)}`,
  }),
});
