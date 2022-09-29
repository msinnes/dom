import { extendz } from '../extendz';

describe('extendz', () => {
  it('should be a function', () => {
    expect(extendz).toBeInstanceOf(Function);
  });

  it('should return true if a class extends another class or if the same class is passed', () => {
    class BaseClass {}
    class ExtendingClass extends BaseClass {}
    class SecondExtendingClass extends ExtendingClass {}
    expect(extendz(ExtendingClass, BaseClass)).toBe(true);
    expect(extendz(SecondExtendingClass, BaseClass)).toBe(true);
    expect(extendz(SecondExtendingClass, ExtendingClass)).toBe(true);
    expect(extendz(BaseClass, BaseClass)).toBe(true);
  });

  it('should return false if a class does not extend another class', () => {
    class BaseClass {}
    class ExtendingClass extends BaseClass {}
    class FailingClass {}
    expect(extendz(FailingClass, BaseClass)).toBe(false);
    expect(extendz(FailingClass, ExtendingClass)).toBe(false);
    expect(extendz(BaseClass, ExtendingClass)).toBe(false);
  });
});
