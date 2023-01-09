function isClass(Class) {
  const isFunction = Class instanceof Function;
  if (!isFunction) return false;
  if (isAbstractClass(Class) || hasAnAbstractMethod(Class)) return true;
  let err;
  try {
    Class();
  } catch(e) {
    err = e;
  }
  return !!err && /^Class constructor [a-zA-Z]+ cannot be invoked without 'new'$/.test(err.message);
}

function isAbstractClass(Class) {
  const isFunction = Class instanceof Function;
  if (!isFunction) return false;
  if (hasAnAbstractMethod(Class)) return true;
  let err;
  try {
    new Class();
  } catch(e) {
    err = e;
  }
  return !!err && err.message === 'TypeError: Abstract classes cannot be instantiated';
}

function extendz(c, Class) {
  // minimal class specification
  // must be defined and have a prototype
  if (!c || !c.prototype) {
    return false;
  }
  // normalize the class
  let curr = c.prototype;
  while(curr) {
    if (curr.constructor === Class.prototype.constructor) {
      return true;
    }
    curr = curr.__proto__;
  }
  return false;
}

function hasAnAbstractMethod(Class) {
  let err;
  try {
    new Class();
  } catch (e) {
    err = e;
  }
  return err ? /TypeError: (.+) is an abstract method and must be on the class prototype/.test(err.message) : false;
}

function hasAbstractMethod(Class, methodName) {
  let err;
  try {
    new Class();
  } catch (e) {
    err = e;
  }
  return !!err && err.message === `TypeError: ${methodName} is an abstract method and must be on the class prototype`;
}

expect.extend({
  toBeAClass: received => ({
    pass: isClass(received),
    message: () => 'expected input to be a class',
  }),
  toBeAbstract: received => ({
    pass: isAbstractClass(received),
    message: () => 'expected input to be an abstract class',
  }),
  toExtend: (received, _super) => ({
    pass: extendz(received, _super),
    message: () => 'input should extend the expected class',
  }),
  toHaveAbstractMethod: (received, methodName) => ({
    pass: hasAbstractMethod(received, methodName),
    message: () => `input should have the abstract method ${methodName}`,
  }),
});