const t = require('@babel/types');

function buildIdentifier(name) {
  return t.identifier(name);
}

function buildStringLiteral(value) {
  return t.stringLiteral(value);
}

module.exports = {
  arrayExpression: (elements) => {
    return t.arrayExpression(elements);
  },
  booleanLiteral: (value) => {
    return t.booleanLiteral(value);
  },
  identifier: (name) => {
    return buildIdentifier(name);
  },
  objectExpression: (properties) => {
    return t.objectExpression(properties);
  },
  objectProperty: (key, value, computed, shorthand, decorators) => {
    const identifier = buildIdentifier(key);
    return t.objectProperty(identifier, value, computed, shorthand, decorators);
  },
  spreadElement: (argument) => {
    return t.spreadElement(argument);
  },
  stringLiteral: (value, extra) => {
    const stringLiteral = {
      ...buildStringLiteral(value),
    };
    if (extra) {
      stringLiteral.extra = extra;
    }
    return stringLiteral;
  },
};