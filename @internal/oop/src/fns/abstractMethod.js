const abstractMethod = function(instance, methodName) {
  if (!(instance[methodName] instanceof Function))
    throw new Error(`TypeError: ${methodName} is an abstract method and must be on the class prototype`);
};

export { abstractMethod };
