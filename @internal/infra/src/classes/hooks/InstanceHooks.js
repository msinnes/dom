import { Hook } from './Hook';

class InstanceHooks {
  current = 0;
  hooks = [];

  constructor(instance) {
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

export { InstanceHooks };
