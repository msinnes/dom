class FetchResponse {
  constructor(ctx) {
    this.close = function() {
      ctx.close();
    };

    this.json = function(value) {
      if (ctx.isDataSet) throw new Error('ImplementationError: Data can only be set once on a response.');
      ctx.setData(value);
    };

    this.text = function(value) {
      if (ctx.isDataSet) throw new Error('ImplementationError: Data can only be set once on a response.');
      ctx.setData(value);
    };
  }
}

export { FetchResponse };
