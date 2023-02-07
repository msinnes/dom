import { DomRef } from '@internal/dom';
import { Context } from '../Context';

import { Renderer } from '../Renderer';

jest.mock('@internal/component', () => {
  const createRootComponentMock = jest.fn();
  const createComponentFactoryMock = jest.fn();
  return {
    createRootComponent: createRootComponentMock,
    createComponentFactory: createComponentFactoryMock,
  };
});

jest.mock('@internal/render', () => {
  const createRenderMock = jest.fn();
  return { createRender: createRenderMock };
});

const renderLibPath = '@internal/render';
const componentLibPath = '@internal/component';

beforeEach(() => {
  const { createRender: createRenderMock } = require(renderLibPath);
  const {
    createRootComponent: createRootComponentMock,
    createComponentFactory: createComponentFactoryMock,
  } = require(componentLibPath);

  const { createRender } = jest.requireActual(renderLibPath);
  const { createRootComponent, createComponentFactory } = jest.requireActual(componentLibPath);

  createRenderMock.mockImplementation(createRender);
  createRootComponentMock.mockImplementation(createRootComponent);
  createComponentFactoryMock.mockImplementation(createComponentFactory);
});

describe('Renderer', () => {
  it('should be a class', () => {
    expect(Renderer).toBeAClass();
  });

  describe('instance', () => {
    class BaseComponent {
      render() {}
    }

    let rootRender;
    let anchor;
    let services;
    let instance;
    let removeValueMock;

    beforeEach(() => {
      rootRender = {};
      anchor = {};
      services = {
        createInstanceHooks: jest.fn(),
        clearContextValue: jest.fn(),
      };
      instance = new Renderer(BaseComponent, rootRender, new DomRef(anchor), services);
      removeValueMock = jest.spyOn(instance.domContext, 'removeValue');
    });

    it('should set the services prop', () => {
      expect(instance.services).toBe(services);
    });

    it('should set a renderingComponent prop to false', () => {
      expect(instance.renderingComponent).toBe(false);
    });

    it('should set a domContext prop', () => {
      expect(instance.domContext).toBeInstanceOf(Context);
    });

    it('should create a root prop', () => {
      expect(instance.root).toBeDefined();
      expect(instance.root.domContext).toBe(instance.domContext);
    });

    it('should create the root prop from the component api', () => {
      const { createRootComponent: createRootComponentMock, createComponentFactory: createComponentFactoryMock } = require(componentLibPath);

      const rootRef = {};
      const createComponentRef = {};
      const BaseComponentRef = {};
      const renderRef = {};
      const anchorRef = {};
      jest.resetAllMocks();
      createRootComponentMock.mockReturnValue(rootRef);
      createComponentFactoryMock.mockReturnValue(createComponentRef);
      instance = new Renderer(BaseComponentRef, renderRef, anchorRef);
      expect(instance.root).toBe(rootRef);
      expect(createRootComponentMock).toHaveBeenCalledTimes(1);
      expect(createRootComponentMock).toHaveBeenCalledWith(renderRef, anchorRef, instance.domContext);
    });

    it('should set a createComponent method', () => {
      expect(instance.createComponent).toBeInstanceOf(Function);
    });

    it('should create the createComponent method from the component api', () => {
      const { createRootComponent: createRootComponentMock, createComponentFactory: createComponentFactoryMock } = require(componentLibPath);

      const rootRef = {};
      const createComponentRef = {};
      const BaseComponentRef = {};
      const renderRef = {};
      const anchorRef = {};
      jest.resetAllMocks();
      createRootComponentMock.mockReturnValue(rootRef);
      createComponentFactoryMock.mockReturnValue(createComponentRef);
      instance = new Renderer(BaseComponentRef, renderRef, anchorRef);
      expect(instance.createComponent).toBe(createComponentRef);
      expect(createComponentFactoryMock).toHaveBeenCalledTimes(1);
      expect(createComponentFactoryMock).toHaveBeenCalledWith(BaseComponentRef, instance.domContext, instance.services);
    });

    describe('mount', () => {
      let createComponentMock;
      beforeEach(() => {
        createComponentMock = jest.spyOn(instance, 'createComponent');
      });

      it('should be a function', () => {
        expect(instance.mount).toBeInstanceOf(Function);
      });

      it('should create a component, mount it to the parent, and return it', () => {
        const instanceMountMock = jest.fn();
        const createdComponentRef = { mount: instanceMountMock };
        createComponentMock.mockReturnValue(createdComponentRef);
        const renderRef = {};
        const parentRef = {};
        const mountedComponent = instance.mount(renderRef, parentRef);
        expect(createComponentMock).toHaveBeenCalledTimes(1);
        expect(createComponentMock).toHaveBeenCalledWith(renderRef);
        expect(instanceMountMock).toHaveBeenCalledTimes(1);
        expect(instanceMountMock).toHaveBeenCalledWith(parentRef);
        expect(mountedComponent).toBe(createdComponentRef);
      });

      it('should call componentDidMount if the method exists on the instance', () => {
        const instanceComponentDidMountMock = jest.fn();
        const baseCreatedComponentRef = { mount: () => {} };
        const renderRef = {};
        const parentRef = {};
        createComponentMock.mockReturnValueOnce(baseCreatedComponentRef);
        instance.mount(renderRef, parentRef);
        expect(instanceComponentDidMountMock).not.toHaveBeenCalled();
        createComponentMock.mockReturnValueOnce({ ...baseCreatedComponentRef, componentDidMount: instanceComponentDidMountMock });
        instance.mount(renderRef, parentRef);
        expect(instanceComponentDidMountMock).toHaveBeenCalledTimes(1);
      });
    });

    describe('render', () => {
      let renderComponentMock;
      let renderChildrenMock;
      beforeEach(() => {
        renderComponentMock = jest.spyOn(instance, 'renderComponent').mockImplementation(() => {});
        renderChildrenMock = jest.spyOn(instance, 'renderChildren').mockImplementation(() => {});
        renderComponentMock.mockReturnValue(new BaseComponent());
      });

      it('should be a function', () => {
        expect(instance.render).toBeInstanceOf(Function);
      });

      it('should call instance.renderComponent', () => {
        const render = { signature: 'div' };
        const { createRender } = require(renderLibPath);
        const appRenderRef = { children: [] };
        createRender.mockImplementation(() => appRenderRef);
        const parentRef = {};
        const currentComponentRef = {};
        instance.render(render, parentRef, currentComponentRef);
        expect(renderComponentMock).toHaveBeenCalledTimes(1);
        expect(renderComponentMock).toHaveBeenCalledWith(appRenderRef, parentRef, currentComponentRef);
      });

      it('should call services.clearContextValue', () => {
        const render = { signature: 'div' };
        const { createRender } = require(renderLibPath);
        const appRenderRef = { children: [] };
        createRender.mockImplementation(() => appRenderRef);
        const parentRef = {};
        const currentComponentRef = {};
        const renderedComponentRef = { signature: {}, render: () => {} };
        renderComponentMock.mockReturnValue(renderedComponentRef);
        instance.render(render, parentRef, currentComponentRef);
        expect(renderComponentMock).toHaveBeenCalledTimes(1);
        expect(renderComponentMock).toHaveBeenCalledWith(appRenderRef, parentRef, currentComponentRef);
        expect(services.clearContextValue).toHaveBeenCalledTimes(1);
        expect(services.clearContextValue).toHaveBeenCalledWith(renderedComponentRef.signature);
      });

      it('should change renderingComponent to true before component render and back to false after', () => {
        const renderMock = jest.fn();
        class TestComponent extends BaseComponent {
          render() {
            renderMock(instance.renderingComponent);
            return { signature: 'div', props: {}, children: [] };
          }
        }

        let render = { signature: TestComponent, props: {} };
        renderComponentMock.mockReturnValue(new TestComponent());
        renderChildrenMock.mockImplementationOnce(() => []);
        const parentRef = {};
        const currentComponentRef = {};
        instance.render(render, parentRef, currentComponentRef);
        expect(instance.renderingComponent).toBe(false);
        expect(renderMock).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledWith(true);
      });

      it('should call the renderChildrenMock if new children are passed', () => {
        const render = { signature: 'div' };
        const { createRender } = require(renderLibPath);
        const nextChildrenRef = ['item'];
        const appRenderRef = { children: nextChildrenRef };
        createRender.mockImplementation(() => appRenderRef);
        const renderComponentRef = {};
        const renderedComponent = { render: () => renderComponentRef };
        renderComponentMock.mockReturnValue(renderedComponent);
        const parentRef = {};
        const currentComponentChildren = [];
        instance.render(render, parentRef, { children: currentComponentChildren });
        expect(renderChildrenMock).toHaveBeenCalledTimes(1);
        expect(renderChildrenMock).toHaveBeenCalledWith(nextChildrenRef, currentComponentChildren, renderedComponent);
      });

      it('should call the renderChildrenMock if old children are passed', () => {
        const render = { signature: 'div' };
        const { createRender } = require(renderLibPath);
        const nextChildrenRef = [];
        const appRenderRef = { children: nextChildrenRef };
        createRender.mockImplementation(() => appRenderRef);
        const renderComponentRef = {};
        const renderedComponent = { render: () => renderComponentRef };
        renderComponentMock.mockReturnValue(renderedComponent);
        const parentRef = {};
        const currentComponentChildren = ['item'];
        instance.render(render, parentRef, { children: currentComponentChildren });
        expect(renderChildrenMock).toHaveBeenCalledTimes(1);
        expect(renderChildrenMock).toHaveBeenCalledWith(nextChildrenRef, currentComponentChildren, renderedComponent);
      });

      it('should not call the renderChildrenMock if no children are passed', () => {
        const render = { signature: 'div' };
        const { createRender } = require(renderLibPath);
        const nextChildrenRef = [];
        const appRenderRef = { children: nextChildrenRef };
        createRender.mockImplementation(() => appRenderRef);
        const renderComponentRef = {};
        const renderedComponent = { render: () => renderComponentRef };
        renderComponentMock.mockReturnValue(renderedComponent);
        const parentRef = {};
        const currentComponentChildren = [];
        instance.render(render, parentRef, { children: currentComponentChildren });
        expect(renderChildrenMock).not.toHaveBeenCalled();
      });

      it('should call the domContext.removeValue if the component is an element component', () => {
        const render = { signature: 'div' };
        const parentRef = {};
        const { createRender } = require(renderLibPath);
        createRender.mockImplementation(() => ({ children: [] }));
        renderComponentMock.mockReturnValue({ isElementComponent: true, children: [], render: () => {} });
        instance.render(render, parentRef);
        expect(removeValueMock).toHaveBeenCalledTimes(1);
      });

      it('should not call the domContext.removeValue if the component is not an element component', () => {
        const render = { signature: 'div' };
        const parentRef = {};
        const { createRender } = require(renderLibPath);
        createRender.mockImplementation(() => ({ children: [] }));
        renderComponentMock.mockReturnValue({ isElementComponent: false, children: [], render: () => {} });
        instance.render(render, parentRef);
        expect(removeValueMock).not.toHaveBeenCalled();
      });
    });

    describe('renderChildren', () => {
      let renderMock;
      beforeEach(() => {
        renderMock = jest.spyOn(instance, 'render').mockImplementation(() => {});
      });

      it('should be a function', () => {
        expect(instance.renderChildren).toBeInstanceOf(Function);
      });

      describe('if previous children is longer than nextChildren', () => {
        it('should call render for each of the next children, and unmount the rest', () => {
          const nextChild1 = {};
          const nextChildren = [nextChild1];
          const unmountMock = jest.fn();
          const componentWillUnmountMock = jest.fn();
          const currentChild1 = { unmount: unmountMock };
          const currentChild2 = { unmount: unmountMock, componentWillUnmount: componentWillUnmountMock };
          const currentChildren = [currentChild1, currentChild2];
          const currentComponent = { children: currentChildren };
          instance.renderChildren(nextChildren, currentChildren, currentComponent);

          expect(renderMock).toHaveBeenCalledTimes(1);
          expect(renderMock.mock.calls[0]).toMatchObject([nextChild1, currentComponent, currentChild1]);

          expect(unmountMock).toHaveBeenCalledTimes(1);
          expect(componentWillUnmountMock).toHaveBeenCalledTimes(1);
        });
      });

      describe('if nextChildren is longer than or equal to currentChildren', () => {
        it('should call render for all nextChildren', () => {
          const nextChild1 = {};
          const nextChild2 = {};
          const nextChildren = [nextChild1, nextChild2];
          const unmountMock = jest.fn();
          const currentChild1 = { unmount: unmountMock };
          const currentChildren = [currentChild1];
          const currentComponent = { children: currentChildren };
          instance.renderChildren(nextChildren, currentChildren, currentComponent);

          expect(renderMock).toHaveBeenCalledTimes(2);
          expect(renderMock.mock.calls[0]).toMatchObject([nextChild1, currentComponent, currentChild1]);
          expect(renderMock.mock.calls[1]).toMatchObject([nextChild2, currentComponent, undefined]);
        });
      });
    });

    describe('renderComponent', () => {
      let mountMock;
      let updateMock;
      beforeEach(() => {
        mountMock = jest.spyOn(instance, 'mount');
        updateMock = jest.spyOn(instance, 'update');
      });

      it('should be a function', () => {
        expect(instance.renderComponent).toBeInstanceOf(Function);
      });

      it('should run mount logic if there is not a current component', () => {
        const renderRef = {};
        const parentRef = {};
        const mountReturnRef = {};
        mountMock.mockReturnValue(mountReturnRef);
        const mountedComponent = instance.renderComponent(renderRef, parentRef);
        expect(mountMock).toHaveBeenCalledTimes(1);
        expect(mountMock).toHaveBeenCalledWith(renderRef, parentRef);
        expect(mountedComponent).toBe(mountReturnRef);
      });

      it('should run update logic if there is not a current component', () => {
        const renderRef = {};
        const parentRef = {};
        const currentComponentRef = {};
        const updateReturnRef = {};
        updateMock.mockReturnValue(updateReturnRef);
        const updatedComponent = instance.renderComponent(renderRef, parentRef, currentComponentRef);
        expect(updateMock).toHaveBeenCalledTimes(1);
        expect(updateMock).toHaveBeenCalledWith(renderRef, currentComponentRef);
        expect(updatedComponent).toBe(updateReturnRef);
      });
    });

    describe('rootRender', () => {
      it('should be a function', () => {
        expect(instance.rootRender).toBeInstanceOf(Function);
      });

      it('should perform a root render on the app and remove a value from the dom context', () => {
        const renderMock = jest.fn();
        const componentRenderRef = {};
        const rootFirstChildRef = {};
        const rootRef = { firstChild: rootFirstChildRef, render: () => componentRenderRef };
        const removeValueMock = jest.fn();

        instance.root = rootRef;
        instance.render = renderMock;
        instance.domContext.removeValue = removeValueMock;
        instance.rootRender();
        expect(renderMock).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledWith(componentRenderRef, instance.root, rootFirstChildRef);
        expect(removeValueMock).toHaveBeenCalledTimes(1);
      });
    });

    describe('update', () => {
      let createComponentMock;
      beforeEach(() => {
        createComponentMock = jest.spyOn(instance, 'createComponent');
      });

      it('should be a function', () => {
        expect(instance.update).toBeInstanceOf(Function);
      });

      it('should create a new component and swap it for the existing component if the component cannot update', () => {
        const renderRef = {};
        const canUpdateMock = jest.fn(() => false);
        const replaceChildMock = jest.fn();
        const currentComponent = {
          canUpdate: canUpdateMock,
          parent: {
            replaceChild: replaceChildMock,
          },
        };
        const newComponentRef = {};
        createComponentMock.mockReturnValue(newComponentRef);
        const updatedComponent = instance.update(renderRef, currentComponent);
        expect(canUpdateMock).toHaveBeenCalledTimes(1);
        expect(canUpdateMock).toHaveBeenCalledWith(renderRef);
        expect(createComponentMock).toHaveBeenCalledTimes(1);
        expect(createComponentMock).toHaveBeenCalledWith(renderRef);
        expect(replaceChildMock).toHaveBeenCalledTimes(1);
        expect(replaceChildMock).toHaveBeenCalledWith(newComponentRef, currentComponent);
        expect(updatedComponent).toBe(newComponentRef);
      });

      it('should call componentWillUnmount and componentDidMount on replaced components', () => {
        const renderRef = {};
        const canUpdateMock = jest.fn(() => false);
        const replaceChildMock = jest.fn();
        const currentComponent = {
          canUpdate: canUpdateMock,
          parent: {
            replaceChild: replaceChildMock,
          },
          componentWillUnmount: jest.fn(),
        };
        const newComponentRef = {
          componentDidMount: jest.fn(),
        };
        createComponentMock.mockReturnValue(newComponentRef);
        const updatedComponent = instance.update(renderRef, currentComponent);
        expect(canUpdateMock).toHaveBeenCalledTimes(1);
        expect(canUpdateMock).toHaveBeenCalledWith(renderRef);
        expect(createComponentMock).toHaveBeenCalledTimes(1);
        expect(createComponentMock).toHaveBeenCalledWith(renderRef);
        expect(replaceChildMock).toHaveBeenCalledTimes(1);
        expect(replaceChildMock).toHaveBeenCalledWith(newComponentRef, currentComponent);
        expect(updatedComponent).toBe(newComponentRef);
        expect(newComponentRef.componentDidMount).toHaveBeenCalledTimes(1);
        expect(currentComponent.componentWillUnmount).toHaveBeenCalledTimes(1);
      });

      it('should update the currentComponent if the component can update', () => {
        const renderProps = {};
        const renderRef = { propsObj: renderProps };
        const canUpdateMock = jest.fn(() => true);
        const updateMock = jest.fn();
        const currentComponent = {
          canUpdate: canUpdateMock,
          update: updateMock,
        };
        const newComponentRef = {};
        const updatedComponent = instance.update(renderRef, currentComponent);
        expect(canUpdateMock).toHaveBeenCalledTimes(1);
        expect(canUpdateMock).toHaveBeenCalledWith(renderRef);
        expect(updateMock).toHaveBeenCalledTimes(1);
        expect(updateMock).toHaveBeenCalledWith(renderProps);
        expect(updatedComponent).toBe(currentComponent);
      });

      it('should call componentDidUpdate if the component has that method', () => {
        const renderProps = {};
        const renderRef = { propsObj: renderProps };
        const canUpdateMock = jest.fn(() => true);
        const updateMock = jest.fn();
        const currentComponent = {
          canUpdate: canUpdateMock,
          update: updateMock,
          componentDidUpdate: jest.fn(),
        };
        const newComponentRef = {};
        const updatedComponent = instance.update(renderRef, currentComponent);
        expect(canUpdateMock).toHaveBeenCalledTimes(1);
        expect(canUpdateMock).toHaveBeenCalledWith(renderRef);
        expect(updateMock).toHaveBeenCalledTimes(1);
        expect(updateMock).toHaveBeenCalledWith(renderProps);
        expect(updatedComponent).toBe(currentComponent);
        expect(currentComponent.componentDidUpdate).toHaveBeenCalledTimes(1);
      });
    });
  });
});
