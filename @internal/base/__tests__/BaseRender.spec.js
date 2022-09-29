import { ArrayRender } from '@internal/render/ArrayRender';
import { EmptyRender } from '@internal/render/EmptyRender';
import { JSXRender } from '@internal/render/JSXRender';
import { StringRender } from '@internal/render/StringRender';

import { createPrivateRender, BaseRender } from '../BaseRender';

describe('createPrivateRender', () => {
  it('should be a function', () => {
    expect(createPrivateRender).toBeInstanceOf(Function);
  });

  it('should return a string render if the input is a string', () => {
    expect(createPrivateRender('string')).toBeInstanceOf(StringRender);
  });

  it('should return an array render if the input is an array', () => {
    const arr = [];
    const filterArrayChildrenMock = jest.fn();
    const instance = { filterArrayChildren: filterArrayChildrenMock };
    expect(createPrivateRender(arr, instance)).toBeInstanceOf(ArrayRender);
    expect(filterArrayChildrenMock).toHaveBeenCalledTimes(1);
    expect(filterArrayChildrenMock).toHaveBeenCalledWith(arr);
  });

  it('should return an empty render with null render.render if the input is null or undefined', () => {
    let out = createPrivateRender(null);
    expect(out).toBeInstanceOf(EmptyRender);
    expect(out.render).toBe(null);
    out = createPrivateRender(undefined);
    expect(out).toBeInstanceOf(EmptyRender);
    expect(out.render).toBe(null);
  });

  it('should return a JSX render if the input render is a valid JSX render', () => {
    const arr = [];
    const filterArrayChildrenMock = jest.fn();
    const validateMock = jest.fn();
    const instance = { filterArrayChildren: filterArrayChildrenMock, validate: validateMock };
    validateMock.mockImplementationOnce(() => true);
    const testRender = { children: arr };
    expect(createPrivateRender(testRender, instance)).toBeInstanceOf(JSXRender);
    expect(validateMock).toHaveBeenCalledTimes(1);
    expect(validateMock).toHaveBeenCalledWith(testRender);
    expect(filterArrayChildrenMock).toHaveBeenCalledTimes(1);
    expect(filterArrayChildrenMock).toHaveBeenCalledWith(arr);
  });

  it('should log a warning and return an empty render if the input render is a function', () => {
    const consoleWarnMock = jest.fn();
    const consoleWarnOriginal = console.warn;
    const warningMessage = 'ImplementationWarning: Function components must be executed and will not render to the DOM.';
    console.warn = consoleWarnMock;
    let out = createPrivateRender(() => {});
    expect(out).toBeInstanceOf(EmptyRender);
    expect(out.render).toBe(null);
    expect(consoleWarnMock).toHaveBeenCalledTimes(1);
    expect(consoleWarnMock).toHaveBeenCalledWith(warningMessage)
    out = createPrivateRender(function () {});
    expect(out).toBeInstanceOf(EmptyRender);
    expect(out.render).toBe(null);
    expect(consoleWarnMock).toHaveBeenCalledTimes(2);
    expect(consoleWarnMock).toHaveBeenCalledWith(warningMessage)
    console.warn = consoleWarnOriginal;
  });

  it('should call toString on the input if the input fails all other checks', () => {
    const d = new Date();
    const filterArrayChildrenMock = jest.fn();
    const validateMock = jest.fn();
    const instance = { filterArrayChildren: filterArrayChildrenMock, validate: validateMock };
    validateMock.mockImplementationOnce(() => false);
    const out = createPrivateRender(d, instance);
    expect(out).toBeInstanceOf(StringRender);
    expect(out.render).toEqual(d.toString());
    expect(validateMock).toHaveBeenCalledTimes(1);
    expect(validateMock).toHaveBeenCalledWith(d);
    expect(filterArrayChildrenMock).not.toHaveBeenCalled();
  });
});

describe('BaseRender', () => {
  class TestableBaseRender extends BaseRender {
    filterArrayChildren() {

    }
    validateSignature() {
      return true;
    }
  }

  it('should be a class', () => {
    expect(BaseRender).toBeAClass();
  });

  it('should have an abstract validateSignature method', () => {
    class FailRender extends BaseRender {
      filterArrayChildren() {}
    }
    expect(FailRender).toHaveAbstractMethod('validateSignature');
  });

  it('should have an abstract filterArrayChildren method', () => {
    class FailRender extends BaseRender {
      validateSignature() {}
    }
    expect(FailRender).toHaveAbstractMethod('filterArrayChildren');
  });

  describe('instance', () => {
    let instance;
    beforeEach(() => {
      instance = new TestableBaseRender('string');
    });

    it('should expose isStringRender, isArrayRender, isJSXRender, and isEmptyRender from the private render', () => {
      expect(instance.isStringRender).toBe(true);
      expect(instance.isJSXRender).toBe(false);
      expect(instance.isArrayRender).toBe(false);
      expect(instance.isEmptyRender).toBe(false);
      expect(instance.render).toEqual('string');
    });

    describe('validateProps', () => {
      it('should be a function', () => {
        expect(instance.validateProps).toBeInstanceOf(Function);
      });

      it('should return true if the input is an instance of Object', () => {
        expect(instance.validateProps({})).toBe(true);
      });

      it('should return false if the input is an Array', () => {
        expect(instance.validateProps([])).toBe(false);
      });

      it('should return false if the input is a Date', () => {
        expect(instance.validateProps(new Date())).toBe(false);
      });

      it('should return false if the input is a Function', () => {
        expect(instance.validateProps(() => {})).toBe(false);
      });

      it('should return false for primitives', () => {
        expect(instance.validateProps('string')).toBe(false);
        expect(instance.validateProps(1)).toBe(false);
        expect(instance.validateProps(true)).toBe(false);
      });
    });

    describe('validateChildren', () => {
      it('should be a function', () => {
        expect(instance.validateChildren).toBeInstanceOf(Function);
      });

      it('should return true if the input is an instance of Array', () => {
        expect(instance.validateChildren([])).toBe(true);
      });

      it('should return false if the input is an Object', () => {
        expect(instance.validateChildren({})).toBe(false);
      });

      it('should return false if the input is a Date', () => {
        expect(instance.validateChildren(new Date())).toBe(false);
      });

      it('should return false if the input is a Function', () => {
        expect(instance.validateChildren(() => {})).toBe(false);
      });

      it('should return false for primitives', () => {
        expect(instance.validateChildren('string')).toBe(false);
        expect(instance.validateChildren(1)).toBe(false);
        expect(instance.validateChildren(true)).toBe(false);
      });
    });

    describe('validate', () => {
      let validateSignatureMock;
      let validatePropsMock;
      let validateChildrenMock;

      beforeEach(() => {
        validateSignatureMock = jest.fn();
        validatePropsMock = jest.fn();
        validateChildrenMock = jest.fn();
        validateSignatureMock.mockImplementation(() => true);
        validatePropsMock.mockImplementation(() => true);
        validateChildrenMock.mockImplementation(() => true);
        instance.validateSignature = validateSignatureMock;
        instance.validateProps = validatePropsMock;
        instance.validateChildren = validateChildrenMock;
      });

      afterEach(() => {
        jest.resetAllMocks();
      });

      it('should be a function', () => {
        expect(instance.validate).toBeInstanceOf(Function);
      });

      it('should call validateSignature, validateProps, and validateChildren', () => {
        const signatureRef = {};
        const propsRef = {};
        const childrenRef = [];
        const render = { signature: signatureRef, props: propsRef, children: childrenRef };
        let out = instance.validate(render);
        expect(out).toBe(true);
        expect(validateSignatureMock).toHaveBeenCalledTimes(1);
        expect(validateSignatureMock).toHaveBeenCalledWith(signatureRef);
        expect(validatePropsMock).toHaveBeenCalledTimes(1);
        expect(validatePropsMock).toHaveBeenCalledWith(propsRef);
        expect(validateChildrenMock).toHaveBeenCalledTimes(1);
        expect(validateChildrenMock).toHaveBeenCalledWith(childrenRef);
      });
    });
  });
});
