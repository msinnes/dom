export const traverse = (node, cb) => {
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