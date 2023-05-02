import { Scope } from '../Scope';

describe('Scope', () => {
  it('should be a class', () => {
    expect(Scope).toBeAClass();
  });

  it('should be abstract', () => {
    expect(Scope).toBeAbstract();
  });

  it('should have an abstract method enable', () => {
    class NoEnableScope extends Scope {
      disable() {}
    }
    expect(NoEnableScope).toHaveAbstractMethod('enable');
  });

  it('should have an abstract method disable', () => {
    class NoEnableScope extends Scope {
      enable() {}
    }
    expect(NoEnableScope).toHaveAbstractMethod('disable');
  });
});
