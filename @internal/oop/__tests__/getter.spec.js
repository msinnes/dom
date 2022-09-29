import { getter } from '../getter';

describe('getter', () => {
  it('should be a function', () => {
    expect(getter).toBeInstanceOf(Function);
  });

  it('should write a value to an instance', () => {
    const instance = {};
    getter(instance, 'field', 'value');
    expect(instance.field).toEqual('value');
  });

  it('should throw an error on write to getter value', () => {
    const instance = {};
    getter(instance, 'field', 'value');
    let message;
    try {
      instance.field = 'another value';
    } catch (e) {
      message = e.message;
    }
    expect(message).toBeDefined();
    expect(message).toEqual('Cannot set property field of #<Object> which has only a getter');
  });
});