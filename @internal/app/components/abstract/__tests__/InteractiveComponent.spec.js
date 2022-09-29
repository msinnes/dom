import { SignatureComponent } from '../SignatureComponent';

import { InteractiveComponent } from '../InteractiveComponent';

describe('InteractiveComponent', () => {
  it('should be a class', () => {
    expect(InteractiveComponent).toBeAClass();
  });

  it('should extend AppComponent', () => {
    expect(InteractiveComponent).toExtend(SignatureComponent);
  });

  it('should have an abstract render method', () => {
    class FailTestComponent extends InteractiveComponent {
      update() {}
      canUpdate() {}
      getNextChildren() {}
      resolve() {}
      writeState() {}
    }
    expect(FailTestComponent).toHaveAbstractMethod('render');
  });

  it('should have an abstract writeState method', () => {
    class FailTestComponent extends InteractiveComponent {
      update() {}
      render() {}
      getNextChildren() {}
      resolve() {}
    }
    expect(FailTestComponent).toHaveAbstractMethod('writeState');
  });

  describe('instance', () => {
    class TestableInteractiveComponent extends InteractiveComponent {
      render() {}
      update() {}
      canUpdate() {}
      writeState() {}
    }

    let instance;
    let propsRef = {};

    beforeEach(() => {
      instance = new TestableInteractiveComponent('string signature', propsRef);
    });

    describe('resolve', () => {
      it('should be a function', () => {
        expect(instance.resolve).toBeInstanceOf(Function);
      });

      it('should return the firstChild.resolve() result', () => {
        const ref = {};
        const comp = { resolve: () => ref };
        instance.appendChild(comp);
        expect(instance.resolve()).toBe(ref);
      });
    });

    describe('getNextChildren', () => {
      it('should be a function', () => {
        expect(instance.getNextChildren).toBeInstanceOf(Function);
      });

      it('should return the appRender.render props as the only child in an array', () => {
        const renderRef = {};
        const nextChildren = instance.getNextChildren({ render: renderRef });
        expect(nextChildren).toBeInstanceOf(Array);
        expect(nextChildren[0]).toBe(renderRef);
      });
    });
  });
});