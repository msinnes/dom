import { abstractMethod } from '../abstractMethod';

describe('abstractMethod', () => {
  it('should be a function', () => {
    expect(abstractMethod).toBeInstanceOf(Function);
  });

  it('should throw an error if an instance is missing the input method', () => {
    class SomeClass {
      method() {}
    }
    const instance = new SomeClass();
    let error;
    try {
      abstractMethod(instance, 'method');
    } catch (e) {
      error = e;
    }
    expect(error).toBeUndefined();
    try {
      abstractMethod(instance, 'anotherMethod');
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
    expect(error.message).toEqual('TypeError: anotherMethod is an abstract method and must be on the class prototype');
  });
});
