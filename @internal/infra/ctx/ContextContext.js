import { Context } from './Context';

class ContextContext {
  get value() {
    return this.values.length ? this.values[0] : this.defaultValue;
  }

  constructor(defaultValue) {
    this.defaultValue = defaultValue;
    this.values = [];
    this.ctx = new Context(this);
  }

  addValue(value) {
    this.values.unshift(value);
  }

  removeValue() {
    this.values.shift();
  }
}

export { ContextContext };