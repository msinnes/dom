import { BaseHookable } from '@internal/base';

import { Scope } from '../Scope';

class TestableScope extends Scope {
  enable() {}
  disable() {}
}

describe('Scope', () => {
  it('should be a class', () => {
    expect(Scope).toBeAClass();
  });

  it('should be abstract', () => {
    expect(Scope).toBeAbstract();
  });

  it('should extend BaseHookable', () => {
    expect(Scope).toExtend(BaseHookable);
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

  describe('instance', () => {
    let instance;
    beforeEach(() => {
      instance = new TestableScope();
    });

    it('should have a children array', () => {
      expect(instance.children).toBeInstanceOf(Array);
    });

    it('should have an open prop', () => {
      expect(instance.open).toEqual(true);
    });

    it('should have a closed prop', () => {
      expect(instance.closed).toEqual(false);
      instance.close();
      expect(instance.closed).toEqual(true);
    });

    describe('append', () => {
      it('should be a function', () => {
        expect(instance.append).toBeInstanceOf(Function);
      });

      it('should add a property based on given name and append to children', () => {
        const scopeRef = {};
        instance.append('scope', scopeRef);
        expect(instance.scope).toBe(scopeRef);
        expect(instance.children.length).toEqual(1);
        expect(instance.children[0]).toBe(scopeRef);
      });
    });

    describe('close', () => {
      it('should be a function', () => {
        expect(instance.close).toBeInstanceOf(Function);
      });

      it('should call the close method for all children and toggle the open prop', () => {
        const closeMock = jest.fn();
        const scope1Ref = {
          close: closeMock,
        };
        const scope2Ref = {
          close: closeMock,
        };
        instance.append('one', scope1Ref);
        instance.append('two', scope2Ref);
        instance.close();
        expect(closeMock).toHaveBeenCalledTimes(2);
        expect(instance.open).toEqual(false);
      });
    });
  });
});
