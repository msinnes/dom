const abstract = function(InputClass) {
  return class AbstractClass extends InputClass {
    constructor(...args) {
      super(...args);
      if (this.constructor === AbstractClass) throw new Error('TypeError: Abstract classes cannot be instantiated');
    }
  };
};

export { abstract };
