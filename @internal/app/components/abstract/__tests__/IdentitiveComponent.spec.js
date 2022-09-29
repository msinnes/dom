import { AppComponent } from '../AppComponent';

import { IdentitiveComponent } from '../IdentitiveComponent';

describe('IdentitiveComponent', () => {
  it('should be a class', () => {
    expect(IdentitiveComponent).toBeAClass();
  });

  it('should extend AppComponent', () => {
    expect(IdentitiveComponent).toExtend(AppComponent);
  });

  it('should have an abstract render method', () => {
    class FailTestComponent extends IdentitiveComponent {
      update() {}
      canUpdate() {}
      getNextChildren() {}
      resolve() {}
    }
    expect(FailTestComponent).toHaveAbstractMethod('render');
  });

  it('should have an abstract canUpdate method', () => {
    class FailTestComponent extends IdentitiveComponent {
      update() {}
      render() {}
      getNextChildren() {}
      resolve() {}
    }
    expect(FailTestComponent).toHaveAbstractMethod('canUpdate');
  });

  describe('instance', () => {
    let instance;
    class TestableAppComponent extends IdentitiveComponent {
      render() {
        return 'output';
      }
      update() {}
      canUpdate() {}
    }

    beforeEach(() => {
      instance = new TestableAppComponent('string signature');
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    describe('resolve', () => {
      it('should be a function', () => {
        expect(instance.resolve).toBeInstanceOf(Function);
      });

      it('should return null by default', () => {
        expect(instance.resolve()).toEqual('output');
      });
    });

    describe('getNextChildren', () => {
      it('should be a function', () => {
        expect(instance.getNextChildren).toBeInstanceOf(Function);
      });

      it('should return an empty array', () => {
        const nextChildren = instance.getNextChildren();
        expect(nextChildren).toBeInstanceOf(Array);
        expect(nextChildren.length).toBe(0);
      });
    });
  });
});