import { abstract } from '../abstract';

describe('abstract', () => {
  const AbstractClass = abstract(class {});

  it('should be a function', () => {
    expect(abstract).toBeInstanceOf(Function);
  });

  it('should return a class', () => {
    expect(AbstractClass).toBeInstanceOf(Function);
    let error;
    try {
      AbstractClass();
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
  });

  it('should not be constructable', () => {
    let error;
    try {
      new AbstractClass();
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
    expect(error.message).toEqual('TypeError: Abstract classes cannot be instantiated');
  });

  it('should be constructable if extended', () => {
    class ExtendedClass extends AbstractClass {};
    let error;
    try {
      new ExtendedClass();
    } catch (e) {
      error = e;
    }
    expect(error).toBeUndefined();
  });

  it('should pass args to original class', () => {
    const BaseClass = abstract(class {
      constructor(arg1, arg2) {
        this.param1 = arg1;
        this.param2 = arg2;
      }
    });

    class ExtendedClass extends BaseClass {}
    const instance = new ExtendedClass('arg1', 'arg2');
    expect(instance.param1).toEqual('arg1');
    expect(instance.param2).toEqual('arg2');
  });
});

