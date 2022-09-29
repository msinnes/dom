export const getter = (instance, field, value) => Object.defineProperty(instance, field, {
  get: () => value,
});
