import { traverse } from './traverse';
import { getRole } from './getRole';

const query = (root, selector) => {
  const results = [];
  const cb = node => {
    const r = selector(node);
    if (r) results.push(r);
  };
  traverse(root, cb);
  return results;
};

export const getByLabelText = (root, q) => {
  const labels = getByText(root, q);
  const labelFors = labels.reduce((acc, item) => {
    if (item.for) acc.push(item.for);
    return acc;
  }, []);
  const selector = node => {
    if (labelFors.includes(node.name)) return node;
  };
  return query(root, selector);
};

export const getByRole = (root, q) => {
  const selector = node => {
    if(getRole(node) === q) return node;
  };
  return query(root, selector);
};

export const getByText = (root, q) => {
  const selector = node => {
    const noChildren = node.children ? node.children.length === 0 : true;
    if (node.innerText === q || (node.textContent === q && noChildren)) return node;
  };
  return query(root, selector);
};
