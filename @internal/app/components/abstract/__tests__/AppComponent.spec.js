import { BaseComponent } from '@internal/base/BaseComponent';

import { AppComponent } from '../AppComponent';

describe('AppComponent', () => {
  it('should be a class', () => {
    expect(AppComponent).toBeAClass();
  });

  it('should have an abstract render method', () => {
    class FailTestComponent extends AppComponent {
      update() {}
      canUpdate() {}
      getNextChildren() {}
      resolve() {}
    }
    expect(FailTestComponent).toHaveAbstractMethod('render');
  });

  it('should have an abstract canUpdate method', () => {
    class FailTestComponent extends AppComponent {
      update() {}
      render() {}
      getNextChildren() {}
      resolve() {}
    }
    expect(FailTestComponent).toHaveAbstractMethod('canUpdate');
  });

  it('should have an abstract getNextChildren method', () => {
    class FailTestComponent extends AppComponent {
      update() {}
      render() {}
      canUpdate() {}
      resolve() {}
    }
    expect(FailTestComponent).toHaveAbstractMethod('getNextChildren');
  });

  it('should have an abstract resolve method', () => {
    class FailTestComponent extends AppComponent {
      update() {}
      render() {}
      canUpdate() {}
      getNextChildren() {}
    }
    expect(FailTestComponent).toHaveAbstractMethod('resolve');
  });

  describe('instance', () => {
    let instance;
    let propsRef = {};
    class TestableAppComponent extends AppComponent {
      render() {}
      update() {}
      canUpdate() {}
      getNextChildren() {}
      resolve() {}
    }

    beforeEach(() => {
      instance = new TestableAppComponent('string signature', propsRef);
    });

    it('should be an instance of BaseComponent', () => {
      expect(instance).toBeInstanceOf(BaseComponent);
    });

    it('should have a signature passed in the constructor', () => {
      expect(instance.signature).toEqual('string signature');
    });

    it('should have props passed in the constructor', () => {
      expect(instance.props).toBe(propsRef);
    });

    it('should default props to an empty object if no props are passed', () => {
      const localInstance = new TestableAppComponent('signature');
      expect(localInstance.props).toBeDefined();
      expect(localInstance.props).toMatchObject({});
    });
  });
});