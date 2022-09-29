class Context {
  constructor(ctxContext) {
    this.Provider = ({ value, children }) => {
      value && ctxContext.addValue(value);
      return children;
    };

    this.Consumer = ({ children }) => {
      const ctxValue = ctxContext.value;
      return children[0](ctxValue);
    };
  }
}

export { Context };
