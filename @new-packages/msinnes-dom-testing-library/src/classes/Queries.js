import { traverse } from '../fns/traverse';

class Queries {
  constructor(container) {
    this.container = container;
  }

  byText(text) {
    if (!text) return [];

    let selector;
    if (text instanceof RegExp) {
      selector = node => {
        if (node.textContent && text.test(node.textContent)) return node;
        if (node.innerText && text.test(node.innerText)) return node;
      };
    } else {
      selector = node => {
        if (node.textContent === text) return node;
        if (node.innerText === text) return node;
      };
    }
    return this.query(selector);
  }

  query(selector) {
    const results = [];
    const cb = node => {
      const result = selector(node);
      if (result) results.push(result);
    };

    traverse(this.container, cb);
    return results;
  }
}

export { Queries };
