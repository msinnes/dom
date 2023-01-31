import { isFunction } from '@new-internal/is';

class UserContext {
  constructor(appContext) {
    this.Provider = ({ value, children }) => {
      let val = value;
      if (isFunction(val)) val = val(appContext.value);
      val && appContext.addValue(val);
      return children;
    };

    this.Consumer = ({ children }) => {
      const ctxValue = appContext.value;
      return children[0](ctxValue);
    };
  }
}

export { UserContext };
