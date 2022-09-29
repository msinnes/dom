import { AppRender } from '../../../AppRender';
import { AppComponent } from '../AppComponent';

import { SignatureComponent } from '../SignatureComponent';

describe('SignatureComponent', () => {
  it('should be a class', () => {
    expect(SignatureComponent).toBeAClass();
  });

  it('should extend AppComponent', () => {
    expect(SignatureComponent).toExtend(AppComponent);
  });

  it('should have an abstract render method', () => {
    class FailTestComponent extends SignatureComponent {
      update() {}
      canUpdate() {}
      getNextChildren() {}
      resolve() {}
      writeState() {}
    }
    expect(FailTestComponent).toHaveAbstractMethod('render');
  });

  describe('instance', () => {
    let instance;
    function InputConstructor() {}
    class TestableSignatureComponent extends SignatureComponent {
      render() {}
      update() {}
      getNextChildren() {}
      resolve() {}
    }

    beforeEach(() => {
      instance = new TestableSignatureComponent(InputConstructor);
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    describe('canUpdate', () => {
      it('should be a function', () => {
        expect(instance.canUpdate).toBeInstanceOf(Function);
      });

      it('should be able to update if the next render has the same signature', () => {
        let render = new AppRender({ signature: InputConstructor, props: {} });
        expect(instance.canUpdate(render)).toBe(true);
        render = new AppRender({ signature: function () {}, props: {} });
        expect(instance.canUpdate(render)).toBe(false);
        render = new AppRender('string');
        expect(instance.canUpdate(render)).toBe(false);
        render = new AppRender([]);
        expect(instance.canUpdate(render)).toBe(false);
        render = new AppRender();
        expect(instance.canUpdate(render)).toBe(false);
      });
    });
  });
});