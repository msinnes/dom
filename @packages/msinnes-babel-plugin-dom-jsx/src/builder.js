const t = require('@babel/types');

const buildIdentifier = name => t.identifier(name);
const buildStringLiteral = value => t.stringLiteral(value);

const builder = {
  arrayExpression: elements => t.arrayExpression(elements),
  booleanLiteral: value => t.booleanLiteral(value),
  identifier: name => buildIdentifier(name),
  memberExpression: (object, property, computed, optional) => t.memberExpression(buildIdentifier(object), buildIdentifier(property), computed, optional),
  objectExpression: properties => t.objectExpression(properties),
  objectProperty: (key, value, computed, shorthand, decorators) => {
    const identifier = buildIdentifier(key);
    return t.objectProperty(identifier, value, computed, shorthand, decorators);
  },
  spreadElement: argument => t.spreadElement(argument),
  stringLiteral: (value, extra) => {
    const stringLiteral = buildStringLiteral(value);
    if (extra) stringLiteral.extra = extra;
    return stringLiteral;
  },
};

export { builder };
