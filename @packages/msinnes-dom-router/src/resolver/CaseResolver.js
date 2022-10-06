import { createElement } from '@msinnes/dom';

import { BaseRouteResolver } from './BaseRouteResolver';

import { ParamsContext } from '../ParamsContext';

class CaseResolver extends BaseRouteResolver {
  constructor(path, exact, render) {
    super(path, exact);

    this.render = render;
  }

  getParams() {
    const foundKeys = this.path.match(this.regex);
    const foundValues = window.location.pathname.match(this.regex);
    if (foundKeys && foundValues && foundKeys.length === foundValues.length) {
      const keys = foundKeys.slice(1);
      const values = foundValues.slice(1);
      return Object.fromEntries(keys.map((key, index) => ([key.slice(1), values[index]])));
    }
    return {};
  }

  resolve() {
    return createElement(ParamsContext.Provider, { value: this.getParams() }, [this.render]);
  }
}

export { CaseResolver };