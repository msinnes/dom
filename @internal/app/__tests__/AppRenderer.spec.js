/**
 * @jest-environment jsdom
 */
import { BaseRenderer } from '@internal/base/BaseRenderer';
import { DomRef } from '@internal/dom/DomRef';
import { extendz } from '@internal/oop/extendz';

import { BaseAppRenderer, AppRenderer, RenderableComponent } from '../AppRenderer';
import { AppRender } from '../AppRender';

import { ArrayComponent } from '../components/ArrayComponent';
import { ClassComponent } from '../components/ClassComponent';
import { ElementComponent } from '../components/ElementComponent';
import { EmptyComponent } from '../components/EmptyComponent';
import { FunctionComponent } from '../components/FunctionComponent';
import { TextComponent } from '../components/TextComponent';
import { AppComponent } from '../components/abstract/AppComponent';

class CreateableComponent extends RenderableComponent {
  render() {}
}

class NewCreateableAppRenderer extends BaseAppRenderer {
  create(render) {
    const appRender = render instanceof AppRender ? render : new AppRender(render);
    const { isArrayRender, isStringRender, isEmptyRender, render: _render } = appRender;
    const { signature, props } = _render || {};
    if (extendz(signature, RenderableComponent)) return new ClassComponent(signature, props, this.composedServices);
    return super.create(appRender);
  }
}

describe('BaseAppRenderer', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('should be a class', () => {
    expect(BaseAppRenderer).toBeAClass();
  });

  it('should extend BaseRenderer', () => {
    expect(BaseAppRenderer).toExtend(BaseRenderer);
  });

  it('should extend base renderer', () => {
    expect(new NewCreateableAppRenderer({ signature: 'div', props: {} }, {}, () => {})).toBeInstanceOf(BaseRenderer);
  });

  describe('instance', () => {
    let instance;
    let renderFrameMock;
    let servicesMock;
    let servicesPropRef;
    beforeEach(() => {
      renderFrameMock = jest.fn();
      servicesPropRef = {};
      servicesMock = {
        createEffectContext: jest.fn(),
        createHookContext: jest.fn(),
        clearContextValue: jest.fn(),
      };
      instance = new NewCreateableAppRenderer({ signature: 'div', props: {} }, servicesMock, renderFrameMock);
    });

    it('should have an AppComponent on its root prop', () => {
      expect(instance.root).toBeInstanceOf(AppComponent);
    });

    it('should have a renderingComponent props set to false by default', () => {
      expect(instance.renderingComponent).toBe(false);
    });

    it('should have a renderFrame method', () => {
      expect(instance.renderFrame).toBeDefined();
      expect(instance.renderFrame).toBe(renderFrameMock);
    });

    it('should have a services prop', () => {
      expect(instance.services).toBeDefined();
      expect(instance.services).toBe(servicesMock);
    });

    it('should have a composedServices getter', () => {
      expect(instance.composedServices).toBeDefined();
      expect(instance.composedServices).toMatchObject({
        ...servicesMock,
        renderFrame: renderFrameMock,
      });
    });

    describe('create', () => {
      it('should be a function', () => {
        expect(instance.create).toBeInstanceOf(Function);
      });

      it('should return an element component if the input signature is a string', () => {
        expect(instance.create({ signature: 'div' })).toBeInstanceOf(ElementComponent);
      });

      it('should return an element component if the input signature is a DomRef', () => {
        expect(instance.create({ signature: new DomRef('div') })).toBeInstanceOf(ElementComponent);
      });

      it('should return a function component if the input signature is a Function', () => {
        expect(instance.create({ signature: () => {} })).toBeInstanceOf(FunctionComponent);
      });

      it('should pass renderFrame to a made Class Component', () => {
        const createdInstance = instance.create({ signature: CreateableComponent });
        createdInstance.instance.setState(1);
        expect(renderFrameMock).toHaveBeenCalledTimes(1);
        expect(renderFrameMock).toHaveBeenCalledWith(createdInstance, 1);
      });

      it('should return a text component if the input render is a string', () => {
        expect(instance.create('text')).toBeInstanceOf(TextComponent);
      });

      it('should return an array component if the input render is an array', () => {
        const createdInstance = instance.create([{ signature: 'div' }]);
        expect(createdInstance).toBeInstanceOf(ArrayComponent);
      });

      it('should return an empty component if the inpu render is null or undefined', () => {
        let createdInstance = instance.create(null);
        expect(createdInstance).toBeInstanceOf(EmptyComponent);
        createdInstance = instance.create(undefined);
        expect(createdInstance).toBeInstanceOf(EmptyComponent);
      });
    });

    describe('render', () => {
      let renderComponentOriginal;
      const renderComponentMock = jest.fn();
      const renderChildrenMock = jest.fn();
      const componentRenderMock = jest.fn();
      const renderComponentRef = new ElementComponent('div');
      renderComponentRef.render = componentRenderMock;

      beforeEach(() => {
        renderComponentOriginal = instance.renderComponent;
        renderComponentMock.mockImplementation(() => renderComponentRef);
        instance.renderComponent = renderComponentMock;
        instance.renderChildren = renderChildrenMock;
        componentRenderMock.mockImplementation(() => ({}));
      });

      it('should be a function', () => {
        expect(instance.render).toBeInstanceOf(Function);
      });

      it('should call the renderComponentMock', () => {
        const props = {};
        const children = [];
        const render = { signature: 'div', props, children };
        const currentComponent = instance.create({ signatrue: 'span', props: {} });
        currentComponent.mount(instance.root);
        componentRenderMock.mockImplementation(() => ({ signature: 'div', props: {} }));

        instance.render(render, instance.root, currentComponent);
        expect(renderComponentMock).toHaveBeenCalledTimes(1);
        expect(renderComponentMock.mock.calls[0][0]).toMatchObject({ render: { signature: 'div', props: { children: [] } }});
        expect(renderComponentMock.mock.calls[0][1]).toEqual(instance.root);
        expect(renderComponentMock.mock.calls[0][2]).toEqual(currentComponent);
      });

      it('should call the renderComponentMock with an empty array of children by default', () => {
        const props = {};
        const render = { signature: 'div', props };
        const currentComponent = instance.create({ signature: 'span', props: {} });
        currentComponent.mount(instance.root);

        componentRenderMock.mockImplementation(() => ({ signature: 'div', props: {} }));

        instance.render(render, instance.root, currentComponent);
        expect(renderComponentMock).toHaveBeenCalledTimes(1);
        expect(renderComponentMock.mock.calls[0][0]).toMatchObject({ render: { signature: 'div', props: { children: [] } } });
        expect(renderComponentMock.mock.calls[0][1]).toEqual(instance.root);
        expect(renderComponentMock.mock.calls[0][2]).toEqual(currentComponent);
      });

      it('should overwrite a children prop if one is passed', () => {
        const children = [];
        const props = { children };
        const render = { signature: 'div', props };
        const currentComponent = instance.create({ signature: 'span', props: {} });
        currentComponent.mount(instance.root);
        componentRenderMock.mockImplementation(() => ({ signature: 'div', props: {} }));

        instance.render(render, instance.root, currentComponent);
        expect(renderComponentMock).toHaveBeenCalledTimes(1);
        expect(renderComponentMock.mock.calls[0][0]).toMatchObject({ render: { signature: 'div', props: { children: [] } } });
        expect(renderComponentMock.mock.calls[0][1]).toEqual(instance.root);
        expect(renderComponentMock.mock.calls[0][2]).toEqual(currentComponent);
      });

      it('should call the renderChildrenMock if children are passed, or the current component has children', () => {
        const props = {};
        let render = { signature: 'div', props };
        const currentComponent = instance.create({ signature: 'span', props: {} });
        currentComponent.mount(instance.root);
        componentRenderMock.mockImplementation(() => ({ signature: 'div', props: {} }));
        instance.render(render, instance.root, currentComponent);
        expect(renderChildrenMock).not.toHaveBeenCalled();
        render = { ...render, children: [] };
        instance.render(render, instance.root, currentComponent);
        expect(renderChildrenMock).not.toHaveBeenCalled();
        const children = [{ signature: 'div', props: {} }];
        componentRenderMock.mockImplementation(() => ({ signature: 'div', props: {}, children }));
        render = { signature: 'div', props, children };
        instance.render(render, instance.root, currentComponent);
        expect(renderChildrenMock).toHaveBeenCalledTimes(1);
        expect(renderChildrenMock).toHaveBeenCalledWith(children, currentComponent.children, renderComponentRef);
        const newChild = instance.create({ signature: 'p', props: {} });
        render = { signature: 'div', props: {}, children: [] };
        newChild.mount(currentComponent);
        instance.render(render, instance.root, currentComponent);
        expect(renderChildrenMock).toHaveBeenCalledTimes(2);
      });

      it('should change renderingComponent to true before component render and back to false after', () => {
        const renderMock = jest.fn();
        renderComponentMock.mockImplementation(renderComponentOriginal);
        class TestComponent extends RenderableComponent {
          render() {
            renderMock(instance.renderingComponent);
            return { signature: 'div', props: {} };
          }
        }

        let render = { signature: TestComponent, props: {} };
        renderChildrenMock.mockImplementationOnce(() => []);
        instance.render(render, instance.root, instance.root.firstChild);
        expect(instance.renderingComponent).toBe(false);
        expect(renderMock).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledWith(true);
      });

      it('should try to clear context at the end of a component render', () => {
        const clearContextValueMock = servicesMock.clearContextValue;

        const props = {};
        const children = [];
        const render = { signature: 'div', props, children };
        const componentRef = {};
        renderComponentMock.mockImplementation(()=> ({
          signature: componentRef,
          render: () => ({}),
          getNextChildren: () => ([]),
        }));

        instance.render(render, instance.root);
        expect(clearContextValueMock).toHaveBeenCalledTimes(1);
        expect(clearContextValueMock).toHaveBeenCalledWith(componentRef);
      });
    });

    describe('resolve', () => {
      it('should be a function', () => {
        expect(instance.resolve).toBeInstanceOf(Function);
      });

      it('should return the renderer.root.firstChild resolve value', () => {
        const renderRef = {};
        instance.root.resolve = () => renderRef;
        expect(instance.resolve()).toBe(renderRef);
      });
    });
  });
});
