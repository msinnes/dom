class Hook {
  constructor(initialValue, component) {
    let _value = initialValue;
    this.get = () => _value;
    this.set = newValue => _value = newValue;
    this.component = component;
  }

  writeState(newState) {
    this.set(newState);
  }
}

export { Hook };
