import { traverse } from '../fns/traverse';
import { getRole } from '../fns/getRole';

const ignoreParentNodesMatcher = (node, ignoreParentNodes = true) => ignoreParentNodes ? node.children.length === 0 : true;
const createConfigMatcher = ({ ignoreParentNodes } = {}) => node => ignoreParentNodesMatcher(node, ignoreParentNodes);

class Queries {
  constructor(container) {
    this.container = container;
  }

  byLabelText(text, config) {
    if (!text) return [];
    const labels = this.byText(text, config);
    const labelFors = labels.reduce((acc, item) => {
      if (item.for) acc.push(item.for);
      return acc;
    }, []);
    const selector = node => {
      if (labelFors.includes(node.name)) return node;
    };
    return this.query(selector);
  }

  byRole(role) {
    if (!role) return [];
    const selector = node => {
      if (getRole(node) === role) return node;
    };
    return this.query(selector);
  }

  byText(text, config) {
    if (!text) return [];
    const configMatcher = createConfigMatcher(config);
    let match;
    if (text instanceof RegExp) {
      match = string => string && text.test(string);
    } else {
      match = string => string === text;
    }
    const selector = node => {
      if (match(node.textContent) && configMatcher(node)) return node;
      if (match(node.innerText) && configMatcher(node)) return node;
    };
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
