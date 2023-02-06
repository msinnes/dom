const builder = require('../builder');

jest.mock('@babel/types', () => ({
  arrayExpression: jest.fn(),
  booleanLiteral: jest.fn(),
  identifier: jest.fn(),
  memberExpression: jest.fn(),
  objectExpression: jest.fn(),
  objectProperty: jest.fn(),
  spreadElement: jest.fn(),
  stringLiteral: jest.fn(),
}))

describe('builder', () => {
  describe('arrayExpression', () => {
    let arrayExpression;
    let babelArrayExpressionMock;
    beforeEach(() => {
      arrayExpression = {};
      babelArrayExpressionMock = require('@babel/types').arrayExpression;
      babelArrayExpressionMock.mockReturnValue(arrayExpression);
    });

    afterEach(jest.resetAllMocks);

    it('should be a function', () => {
      expect(builder.arrayExpression).toBeInstanceOf(Function);
    });

    it('should call the mock and return the value', () => {
      const elements = [];
      expect(builder.arrayExpression(elements)).toBe(arrayExpression);
      expect(babelArrayExpressionMock).toHaveBeenCalledTimes(1);
      expect(babelArrayExpressionMock).toHaveBeenCalledWith(elements);
    });
  });

  describe('booleanLiteral', () => {
    let booleanLiteral;
    let babelBooleanLiteralMock;
    beforeEach(() => {
      booleanLiteral = {};
      babelBooleanLiteralMock = require('@babel/types').booleanLiteral;
      babelBooleanLiteralMock.mockReturnValue(booleanLiteral);
    });

    afterEach(jest.resetAllMocks);

    it('should be a function', () => {
      expect(builder.booleanLiteral).toBeInstanceOf(Function);
    });

    it('should call the mock and return the value', () => {
      const value = {};
      expect(builder.booleanLiteral(value)).toBe(booleanLiteral);
      expect(babelBooleanLiteralMock).toHaveBeenCalledTimes(1);
      expect(babelBooleanLiteralMock).toHaveBeenCalledWith(value);
    });
  });

  describe('identifier', () => {
    let identifier;
    let babelIdentifierMock;
    beforeEach(() => {
      identifier = {};
      babelIdentifierMock = require('@babel/types').identifier;
      babelIdentifierMock.mockReturnValue(identifier);
    });

    afterEach(jest.resetAllMocks);

    it('should be a function', () => {
      expect(builder.identifier).toBeInstanceOf(Function);
    });

    it('should call the mock and return the value', () => {
      const name = 'name';
      expect(builder.identifier(name)).toBe(identifier);
      expect(babelIdentifierMock).toHaveBeenCalledTimes(1);
      expect(babelIdentifierMock).toHaveBeenCalledWith(name);
    });
  });

  describe('memberExpression', () => {
    let identifier;
    let memberExpression;
    let babelIdentifierMock;
    let babelMemberExpressionMock;
    beforeEach(() => {
      identifier = {};
      memberExpression = {};
      babelIdentifierMock = require('@babel/types').identifier;
      babelMemberExpressionMock = require('@babel/types').memberExpression;
      babelIdentifierMock.mockReturnValue(identifier);
      babelMemberExpressionMock.mockReturnValue(memberExpression);
    });

    afterEach(jest.resetAllMocks);

    it('should be a function', () => {
      expect(builder.memberExpression).toBeInstanceOf(Function);
    });

    it('should call the mock and return the value', () => {
      const object = 'object';
      const property = 'property';
      const computed = {};
      const optional = {};
      expect(builder.memberExpression(object, property, computed, optional)).toBe(memberExpression);
      expect(babelIdentifierMock).toHaveBeenCalledTimes(2);
      expect(babelIdentifierMock).toHaveBeenCalledWith(object);
      expect(babelIdentifierMock).toHaveBeenCalledWith(property);
      expect(babelMemberExpressionMock).toHaveBeenCalledTimes(1);
      expect(babelMemberExpressionMock).toHaveBeenCalledWith(identifier, identifier, computed, optional);
    });
  });

  describe('objectExpression', () => {
    let objectExpression;
    let babelObjectExpressionMock;
    beforeEach(() => {
      objectExpression = {};
      babelObjectExpressionMock = require('@babel/types').objectExpression;
      babelObjectExpressionMock.mockReturnValue(objectExpression);
    });

    afterEach(jest.resetAllMocks);

    it('should be a function', () => {
      expect(builder.objectExpression).toBeInstanceOf(Function);
    });

    it('should call the mock and return the value', () => {
      const properties = {};
      expect(builder.objectExpression(properties)).toBe(objectExpression);
      expect(babelObjectExpressionMock).toHaveBeenCalledTimes(1);
      expect(babelObjectExpressionMock).toHaveBeenCalledWith(properties);
    });
  });

  describe('objectProperty', () => {
    let identifier;
    let objectProperty;
    let babelIdentifierMock;
    let babelObjectPropertyMock;
    beforeEach(() => {
      identifier = {};
      objectProperty = {};
      babelIdentifierMock = require('@babel/types').identifier;
      babelObjectPropertyMock = require('@babel/types').objectProperty;
      babelIdentifierMock.mockReturnValue(identifier);
      babelObjectPropertyMock.mockReturnValue(objectProperty);
    });

    afterEach(jest.resetAllMocks);

    it('should be a function', () => {
      expect(builder.objectProperty).toBeInstanceOf(Function);
    });

    it('should call the mock and return the value', () => {
      const key = 'key';
      const value = 'value';
      const computed = {};
      const shorthand = {};
      const decorators = {};
      expect(builder.objectProperty(key, value, computed, shorthand, decorators)).toBe(objectProperty);
      expect(babelIdentifierMock).toHaveBeenCalledTimes(1);
      expect(babelIdentifierMock).toHaveBeenCalledWith(key);
      expect(babelObjectPropertyMock).toHaveBeenCalledTimes(1);
      expect(babelObjectPropertyMock).toHaveBeenCalledWith(identifier, value, computed, shorthand, decorators);
    });
  });

  describe('spreadElement', () => {
    let spreadElement;
    let babelSpreadElementMock;
    beforeEach(() => {
      spreadElement = {};
      babelSpreadElementMock = require('@babel/types').spreadElement;
      babelSpreadElementMock.mockReturnValue(spreadElement);
    });

    afterEach(jest.resetAllMocks);

    it('should be a function', () => {
      expect(builder.spreadElement).toBeInstanceOf(Function);
    });

    it('should call the mock and return the value', () => {
      const value = {};
      expect(builder.spreadElement(value)).toBe(spreadElement);
      expect(babelSpreadElementMock).toHaveBeenCalledTimes(1);
      expect(babelSpreadElementMock).toHaveBeenCalledWith(value);
    });
  });

  describe('stringLiteral', () => {
    let stringLiteral;
    let babelStringLiteralMock;
    beforeEach(() => {
      stringLiteral = {};
      babelStringLiteralMock = require('@babel/types').stringLiteral;
      babelStringLiteralMock.mockReturnValue(stringLiteral);
    });

    afterEach(jest.resetAllMocks);

    it('should be a function', () => {
      expect(builder.stringLiteral).toBeInstanceOf(Function);
    });

    it('should call the mock and return the value', () => {
      expect(builder.stringLiteral('text')).toBe(stringLiteral);
      expect(babelStringLiteralMock).toHaveBeenCalledTimes(1);
      expect(babelStringLiteralMock).toHaveBeenCalledWith('text');
    });

    it('should append extra to the return if it is passed', () => {
      expect(builder.stringLiteral('text')).toBe(stringLiteral);
      expect(babelStringLiteralMock).toHaveBeenCalledTimes(1);
      expect(babelStringLiteralMock).toHaveBeenCalledWith('text');
      expect(stringLiteral.extra).toBeUndefined();
      expect(builder.stringLiteral('text', 'extra')).toBe(stringLiteral);
      expect(babelStringLiteralMock).toHaveBeenCalledTimes(2);
      expect(babelStringLiteralMock).toHaveBeenCalledWith('text');
      expect(stringLiteral.extra).toEqual('extra');
    });
  });
});