import { Hook } from "./Hook";

class HookContext {
  constructor(instance) {
    this.hooks = [];
    this.current = 0;
    this.instance = instance;
  }

  finish() {
    this.current = 0;
  }

  next(initialValue) {
    let hook = this.hooks[this.current++];
    if (!hook) {
      hook = new Hook(initialValue, this.instance);
      this.hooks.push(hook);
    }
    return hook;
  }
}

export { HookContext };