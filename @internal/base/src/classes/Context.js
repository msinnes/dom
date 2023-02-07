class Context {
  values = [];

  get value() {
    const len = this.values.length;
    return len ? this.values[len - 1] : this.defaultValue;
  }

  constructor(defaultValue) {
    this.defaultValue = defaultValue;
  }

  addValue(value) {
    this.values.push(value);
  }

  removeValue(value) {
    this.values.pop();
  }
}

export { Context };
