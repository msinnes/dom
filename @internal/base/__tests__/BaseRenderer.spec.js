import { BaseRenderer } from '../BaseRenderer';
import { BaseComponent } from '../BaseComponent';
import { BaseRender } from '../BaseRender';

const mountMock = jest.fn();
const replaceChildMock = jest.fn();
const updateMock = jest.fn();

class TestComponent extends BaseComponent {
  constructor(render) {
    super();
    this.signature = render.signature;
    this.props = render.props;
  }

  canUpdate(render) {
    return canComponentUpdateMock();
  }

  mount(parent) {
    mountMock(parent);
    super.mount(parent);
  }

  replaceChild(...args) {
    replaceChildMock(...args);
    super.replaceChild(...args);
  }

  update(...args){
    updateMock(...args);
  }
}

class TestRender extends BaseRender {
  filterArrayChildren() {
    return [];
  }
  validateSignature() {
    return true;
  }
}

const createMock = jest.fn();
const canComponentUpdateMock = jest.fn();
const renderMock = jest.fn();

describe('BaseRenderer', () => {
  class TestableBaseRenderer extends BaseRenderer {
    create(render) {
      return createMock(render);
    }

    render(...args) {
      return renderMock(...args);
    }
  }
  beforeEach(() => {
    canComponentUpdateMock.mockImplementation(() => true);
    createMock.mockImplementation((...args) => new TestComponent(...args));
  });

  afterEach(jest.resetAllMocks);

  it('should be a class', () => {
    expect(BaseRenderer).toBeAClass();
  });

  it('should have an abstract create method', () => {
    class FailTestComponent extends BaseRenderer {
      canComponentUpdate() {}
      render() {}
    }
    expect(FailTestComponent).toHaveAbstractMethod('create');
  });

  it('should have an abstract render method', () => {
    class FailTestComponent extends BaseRenderer {
      create() {}
      canComponentUpdate() {}
    }
    expect(FailTestComponent).toHaveAbstractMethod('render');
  });

  describe('instance', () => {
    let instance;
    let renderFrameMock;
    let servicesMock;
    const signatureRef = {};
    const propsRef = {};

    beforeEach(() => {
      renderFrameMock = jest.fn();
      servicesMock = {};
      instance = new TestableBaseRenderer({ signature: signatureRef,  props: propsRef }, servicesMock, renderFrameMock);
    });

    it('should have a root prop that is instance returned from create method', () => {
      expect(createMock).toHaveBeenCalledTimes(1);
      expect(instance.root).toBeInstanceOf(TestComponent);
    });

    it('should pass the signature and props to the created component', () => {
      expect(instance.root.signature).toBe(signatureRef);
      expect(instance.root.props).toBe(propsRef);
    });

    it('should have a renderFrame method', () => {
      expect(instance.renderFrame).toBeDefined();
      expect(instance.renderFrame).toBe(renderFrameMock);
    });

    it('should have a services prop', () => {
      expect(instance.services).toBeDefined();
      expect(instance.services).toBe(servicesMock);
    });

    describe('mount', () => {
      it('should be a function', () => {
        expect(instance.mount).toBeInstanceOf(Function);
      });

      it('should create a component instance, mount the component, and return the new instance', () => {
        const localSignatureRef = {};
        const localPropsRef = {};
        const newInstance = instance.mount(new TestRender({ signature: localSignatureRef, props: localPropsRef }), instance.root);
        expect(createMock).toHaveBeenCalledTimes(2);
        // it should create the new component
        expect(createMock.mock.calls[0][0]).toMatchObject({ signature: signatureRef, props: propsRef });
        expect(createMock.mock.calls[1][0].render).toMatchObject({ signature: localSignatureRef, props: localPropsRef });

        // it should mount the component
        expect(mountMock).toHaveBeenCalledTimes(1);
        expect(mountMock).toHaveBeenCalledWith(instance.root);

        expect(newInstance).toBeInstanceOf(TestComponent);
      });

      it('should execute the componentDidMount hook if one is present on the component instance', () => {
        const didMountMock = jest.fn();
        class DidMountComponent extends TestComponent {
          componentDidMount() {
            didMountMock();
          }
        }

        createMock.mockImplementationOnce((...args) => new DidMountComponent(...args));

        const localSignatureRef = {};
        const localPropsRef = {};
        const newInstance = instance.mount(new TestRender({ signature: localSignatureRef, props: localPropsRef }), instance.root);
        expect(createMock).toHaveBeenCalledTimes(2);
        // it should create the new component
        expect(createMock.mock.calls[0][0]).toMatchObject({ signature: signatureRef, props: propsRef });
        expect(createMock.mock.calls[1][0].render).toMatchObject({ signature: localSignatureRef, props: localPropsRef });

        // it should mount the component
        expect(mountMock).toHaveBeenCalledTimes(1);
        expect(mountMock).toHaveBeenCalledWith(instance.root);

        expect(newInstance).toBeInstanceOf(DidMountComponent);
        expect(didMountMock).toHaveBeenCalledTimes(1);
      });
    });

    describe('renderChildren', () => {
      const renderRef = {};

      beforeEach(() => {
        renderMock.mockImplementation(() => renderRef);
      });

      it('should be a function', () => {
        expect(instance.renderChildren).toBeInstanceOf(Function);
      });

      it('should return an array by default', () => {
        const ret = instance.renderChildren([], [], instance.root);
        expect(Array.isArray(ret)).toBe(true);
      });


      describe('if nextChildren is longer than or equal to currentChildren', () => {
        it('should call render for all nextChildren', () => {
          const nextChild1 = {};
          const nextChild2 = {};
          const nextChildren = [nextChild1, nextChild2];
          const currentChild1 = instance.mount(new TestRender({ signature: {}, props: {} }), instance.root);
          const currentChildren = [currentChild1];
          let renderedChildren = instance.renderChildren(nextChildren, currentChildren, instance.root);

          expect(renderMock).toHaveBeenCalledTimes(2);
          expect(renderMock.mock.calls[0]).toMatchObject([nextChild1, instance.root, currentChild1]);
          expect(renderMock.mock.calls[1]).toMatchObject([nextChild2, instance.root, undefined]);

          expect(renderedChildren.length).toEqual(2);
          expect(renderedChildren).toMatchObject([renderRef, renderRef]);

          const currentChild2 = instance.mount(new TestRender({ signature: {}, props: {} }), instance.root);
          currentChildren.push(currentChild2);
          renderedChildren = instance.renderChildren(nextChildren, currentChildren, instance.root);

          expect(renderMock).toHaveBeenCalledTimes(4);
          expect(renderMock.mock.calls[2]).toMatchObject([nextChild1, instance.root, currentChild1]);
          expect(renderMock.mock.calls[3]).toMatchObject([nextChild2, instance.root, currentChild2]);
        });
      });

      describe('if previous children is longer than nextChildren', () => {
        it('should call render for each of the next children, and unmount the rest', () => {
          const nextChild1 = {};
          const nextChildren = [nextChild1];
          const currentChild1 = instance.mount(new TestRender({ singaure: {}, props: {} }), instance.root);
          const currentChild2 = instance.mount(new TestRender({ singature: {}, props: {} }), instance.root);
          const currentChildren = [currentChild1, currentChild2];
          const renderedChildren = instance.renderChildren(nextChildren, currentChildren, instance.root);

          expect(renderMock).toHaveBeenCalledTimes(1);
          expect(renderMock.mock.calls[0]).toMatchObject([nextChild1, instance.root, currentChild1]);

          expect(renderedChildren.length).toEqual(1);
          expect(renderedChildren).toMatchObject([renderRef]);
        });

        it('should call componentWillUnmount on any child that has that lifecycle hook', () => {
          const willUnmountMock = jest.fn();
          class WillUnmountComponent extends TestComponent {
            componentWillUnmount() {
              willUnmountMock();
            }
          }

          const nextChild1 = {};
          const nextChildren = [nextChild1];
          const currentChild1 = instance.mount(new TestRender({ singaure: {}, props: {} }), instance.root);
          const currentChild2 = instance.mount(new TestRender({ singature: {}, props: {} }), instance.root);

          createMock.mockImplementationOnce((...args) => new WillUnmountComponent(...args));

          const currentChild3 = instance.mount(new TestRender({ singature: {}, props: {} }), instance.root);

          const currentChildren = [currentChild1, currentChild2, currentChild3];
          const renderedChildren = instance.renderChildren(nextChildren, currentChildren, instance.root);

          expect(renderMock).toHaveBeenCalledTimes(1);
          expect(renderMock.mock.calls[0]).toMatchObject([nextChild1, instance.root, currentChild1]);

          expect(renderedChildren.length).toEqual(1);
          expect(renderedChildren).toMatchObject([renderRef]);

          expect(willUnmountMock).toHaveBeenCalledTimes(1);
        });

        it('should call destroyEffect on components with that property', () => {
          let destroyEffectMock = jest.fn();
          class EffectComponent extends TestComponent {
            destroyEffect() {
              destroyEffectMock();
            }
          }

          const nextChild1 = {};
          const nextChildren = [nextChild1];
          const currentChild1 = instance.mount(new TestRender({ singaure: {}, props: {} }), instance.root);
          const currentChild2 = instance.mount(new TestRender({ singature: {}, props: {} }), instance.root);

          createMock.mockImplementationOnce((...args) => new EffectComponent(...args));

          const currentChild3 = instance.mount(new TestRender({ singature: {}, props: {} }), instance.root);

          const currentChildren = [currentChild1, currentChild2, currentChild3];
          const renderedChildren = instance.renderChildren(nextChildren, currentChildren, instance.root);

          expect(renderMock).toHaveBeenCalledTimes(1);
          expect(renderMock.mock.calls[0]).toMatchObject([nextChild1, instance.root, currentChild1]);

          expect(renderedChildren.length).toEqual(1);
          expect(renderedChildren).toMatchObject([renderRef]);

          expect(destroyEffectMock).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe('renderComponent', () => {
      it('should be a function', () => {
        expect(instance.renderComponent).toBeInstanceOf(Function);
      });

      it('should run mount logic if only a render, and parent are passed and return the mounted component', () => {
        const localSignatureRef = {};
        const localPropsRef = {};
        const renderedComponent = instance.renderComponent(new TestRender({ signature: localSignatureRef, props: localPropsRef }), instance.root);

        expect(createMock).toHaveBeenCalledTimes(2);
        expect(mountMock).toHaveBeenCalledTimes(1);
        expect(mountMock).toHaveBeenCalledWith(instance.root);
        expect(updateMock).not.toHaveBeenCalled();
        expect(createMock.mock.calls[1][0]).toMatchObject({ render: { signature: localSignatureRef, props: localPropsRef } });

        expect(renderedComponent).toBeInstanceOf(TestComponent);
      });

      it('should run update logic if a currentComponent is passed', () => {
        const localSignatureRef = {};
        const localPropsRef = {};
        const currentComponent = instance.mount(new TestRender({ signature: localSignatureRef, props: localPropsRef }), instance.root);
        const render = new TestRender({ signature: localSignatureRef, props: localPropsRef });
        const renderedComponent = instance.renderComponent(render, instance.root, currentComponent);

        expect(createMock).toHaveBeenCalledTimes(2);
        expect(mountMock).toHaveBeenCalledTimes(1);
        expect(updateMock).toHaveBeenCalledTimes(1);
        expect(updateMock).toHaveBeenCalledWith(localPropsRef);

        expect(renderedComponent).toBe(currentComponent);
      });
    });

    describe('update', () => {
      it('should be a function', () => {
        expect(instance.update).toBeInstanceOf(Function);
      });

      it('should update the current component and return the currentComponent if it can', () => {
        const localSignatureRef = {};
        const localPropsRef = {};
        const currentComponent = instance.create(new TestRender({ signature: localSignatureRef, props: propsRef }));
        currentComponent.mount(instance.root);
        const render = new TestRender({ signature: localSignatureRef, props: localPropsRef });
        const updatedComponent = instance.update(render, currentComponent);

        expect(updateMock).toHaveBeenCalledTimes(1);
        expect(updateMock).toHaveBeenCalledWith(localPropsRef);

        expect(updatedComponent).toBe(currentComponent);
      });

      it('should call componentDidUpdate on a component with that lifecycle hook', () => {
        const didUpdateMock = jest.fn();
        class DidUpdateComponent extends TestComponent {
          componentDidUpdate() {
            didUpdateMock();
          }
        }

        createMock.mockImplementationOnce((...args) => new DidUpdateComponent(...args));

        const localSignatureRef = {};
        const localPropsRef = {};
        const currentComponent = instance.create(new TestRender({ signature: localSignatureRef, props: propsRef }));
        currentComponent.mount(instance.root);
        const render = new TestRender({ signature: localSignatureRef, props: localPropsRef });
        const updatedComponent = instance.update(render, currentComponent);

        expect(updateMock).toHaveBeenCalledTimes(1);
        expect(updateMock).toHaveBeenCalledWith(localPropsRef);

        expect(updatedComponent).toBe(currentComponent);
        expect(didUpdateMock).toHaveBeenCalledTimes(1);
      });

      it('should create a new component, swap it with the old component, and return the new component if the component cannot update', () => {
        const localSignatureRef = {};
        const localPropsRef = {};
        const currentComponent = instance.create(new TestRender({ signature: signatureRef, props: propsRef }));
        currentComponent.mount(instance.root);

        canComponentUpdateMock.mockImplementationOnce(() => false);
        updateMock.mockImplementationOnce(() => new TestComponent({}));
        const render = new TestRender({ signature: localSignatureRef, props: localPropsRef });
        const updatedComponent = instance.update(render, currentComponent);

        // it should create a new component
        expect(createMock).toHaveBeenCalledTimes(3);
        expect(createMock.mock.calls[2][0]).toMatchObject(render);

        // it should swap the new component on the parent
        expect(replaceChildMock).toHaveBeenCalledTimes(1);
        expect(replaceChildMock.mock.calls[0][0]).toBeInstanceOf(TestComponent);
        expect(replaceChildMock.mock.calls[0][1]).toBe(currentComponent);

        // it should return the new component
        expect(updatedComponent).not.toBe(currentComponent);
        expect(updatedComponent).toBeInstanceOf(TestComponent);
      });

      it('should call componentWillUnmount and componentDidMount during a swap if either component has the lifecycle hook', () => {
        const didMountMock = jest.fn();
        const willUnmountMock = jest.fn();
        class DidMountComponent extends TestComponent {
          componentDidMount() {
            didMountMock();
          }
        }
        class WillUnmountComponent extends TestComponent {
          componentWillUnmount() {
            willUnmountMock();
          }
        }

        createMock.mockImplementationOnce((...args) => new WillUnmountComponent(...args));

        const localSignatureRef = {};
        const localPropsRef = {};
        const currentComponent = instance.create(new TestRender({ signature: signatureRef, props: propsRef }));
        currentComponent.mount(instance.root);

        canComponentUpdateMock.mockImplementationOnce(() => false);
        updateMock.mockImplementationOnce(() => new TestComponent({}));
        const render = new TestRender({ signature: localSignatureRef, props: localPropsRef });

        createMock.mockImplementationOnce((...args) => new DidMountComponent(...args));
        const updatedComponent = instance.update(render, currentComponent);

        // it should create a new component
        expect(createMock).toHaveBeenCalledTimes(3);
        expect(createMock.mock.calls[2][0]).toMatchObject(render);

        // it should swap the new component on the parent
        expect(replaceChildMock).toHaveBeenCalledTimes(1);
        expect(replaceChildMock.mock.calls[0][0]).toBeInstanceOf(TestComponent);
        expect(replaceChildMock.mock.calls[0][1]).toBe(currentComponent);

        // it should return the new component
        expect(updatedComponent).not.toBe(currentComponent);
        expect(updatedComponent).toBeInstanceOf(TestComponent);

        expect(willUnmountMock).toHaveBeenCalledTimes(1);
        expect(didMountMock).toHaveBeenCalledTimes(1);
      });

      it('should execute destroyEffect on a component before unmounting', () => {
        const destroyEffectMock = jest.fn();
        class EffectComponent extends TestComponent {
          destroyEffect() {
            destroyEffectMock();
          }
        }

        class NoEffectComponent extends TestComponent {}

        createMock.mockImplementationOnce((...args) => new EffectComponent(...args));

        const localSignatureRef = {};
        const localPropsRef = {};
        const currentComponent = instance.create(new TestRender({ signature: signatureRef, props: propsRef }));
        currentComponent.mount(instance.root);

        canComponentUpdateMock.mockImplementationOnce(() => false);
        updateMock.mockImplementationOnce(() => new TestComponent({}));
        const render = new TestRender({ signature: localSignatureRef, props: localPropsRef });

        createMock.mockImplementationOnce((...args) => new NoEffectComponent(...args));
        const updatedComponent = instance.update(render, currentComponent);

        // it should create a new component
        expect(createMock).toHaveBeenCalledTimes(3);
        expect(createMock.mock.calls[2][0]).toMatchObject(render);

        // it should swap the new component on the parent
        expect(replaceChildMock).toHaveBeenCalledTimes(1);
        expect(replaceChildMock.mock.calls[0][0]).toBeInstanceOf(TestComponent);
        expect(replaceChildMock.mock.calls[0][1]).toBe(currentComponent);

        // it should return the new component
        expect(updatedComponent).not.toBe(currentComponent);
        expect(updatedComponent).toBeInstanceOf(TestComponent);

        // it should have run the destroyEffectMock
        expect(destroyEffectMock).toHaveBeenCalledTimes(1);
      });

      it('should update the previous string render if the next render is a string', () => {
        const currentComponent = instance.create(new TestRender('initial text'));
        const updatedComponent = instance.update(new TestRender('next text'), currentComponent);
        expect(updateMock).toHaveBeenCalledTimes(1);
        expect(updateMock).toHaveBeenCalledWith('next text');
        expect(updatedComponent).toBe(currentComponent);
      });
    });
  });
});
