import { isFunction } from '@internal/is/function';

class Context {
  constructor(ctxContext) {
    this.Provider = ({ value, children }) => {
      let val = value;
      if (isFunction(val)) val = val(ctxContext.value);
      val && ctxContext.addValue(val);
      return children;
    };

    this.Consumer = ({ children }) => {
      const ctxValue = ctxContext.value;
      return children[0](ctxValue);
    };
  }
}

export { Context };
