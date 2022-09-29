export const extendz = function(c, Class) {
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
