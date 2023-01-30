const traverse = (node, cb) => {
  cb(node);
  if (node.children && node.children.length) {
    const len = node.children.length;
    for (let i = 0; i < len; i++) {
      traverse(node.children[i], cb);
    }
  }
};

export { traverse };
