class FetchResponse {
  hasSet = false;

  constructor(setter) {
    this.json = value => {
      if (this.hasSet) throw new Error('ImplementationError: Data can only be set once on a response.');
      setter(value);
      this.hasSet = true;
    };

    this.text = value => {
      if (this.hasSet) throw new Error('ImplementationError: Data can only be set once on a response.');
      setter(value);
      this.hasSet = true;
    };
  }
}

export { FetchResponse };
