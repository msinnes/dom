import { abstract } from '@internal/oop';

const Hookable = abstract(class {
  hooks = {};

  hook(key, fn) {
    if (this.hooks[key]) this.hooks[key].push(fn);
    else this.hooks[key] = [fn];
  }

  trigger(key, ...args) {
    if (this.hooks[key]) this.hooks[key].forEach(hook => hook(...args));
  }
});

export { Hookable };
