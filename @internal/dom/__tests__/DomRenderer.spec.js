/**
 * @jest-environment jsdom
 */
import { BaseRenderer } from '@internal/base/BaseRenderer';

import { DomRenderer } from '../DomRenderer';

import { ArrayComponent, DomComponent, StringComponent } from '../DomComponent';
import { DomRef } from '../DomRef';

describe('DomRenderer', () => {
  it('should be a class', () => {
    expect(DomRenderer).toBeAClass();
  });

  it('should extend BaseRenderer', () => {
    expect(DomRenderer).toExtend(BaseRenderer);
  });

  describe('instance', () => {
    let instance;

    beforeEach(() => {
      instance = new DomRenderer({ signature: 'div', props: {} });
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should have an instance of DomComponent on its root prop', () => {
      expect(instance.root).toBeInstanceOf(DomComponent);
    });

    describe('create', () => {
      it('should be a function', () => {
        expect(instance.create).toBeInstanceOf(Function);
      });

      it('should return an instance of DomComponent', () => {
        const newInstance = instance.create({ signature: 'div', props: {} });
        expect(newInstance).toBeInstanceOf(DomComponent);
      });

      it('should return an instance of StringComponent if the input render is a string', () => {
        const newInstance = instance.create('text');
        expect(newInstance).toBeInstanceOf(StringComponent);
      });

      it('should nest dom components in an array', () => {
        const render1 = [{ signature: 'div', props: {} }];
        const render2 = { signature: 'div', props: {} };
        const newInstance = instance.create([render1, render2]);
        expect(newInstance).toBeInstanceOf(ArrayComponent);
        expect(newInstance.elems[0]).toBe(render1);
        expect(newInstance.elems[1]).toBe(render2);
      });
    });

    describe('render', () => {
      const renderComponentMock = jest.fn();
      const renderChildrenMock = jest.fn();
      const renderComponentRef = {};

      beforeEach(() => {
        renderComponentMock.mockImplementation(() => renderComponentRef);
        instance.renderComponent = renderComponentMock;
        instance.renderChildren = renderChildrenMock;
      });

      it('should be a function', () => {
        expect(instance.render).toBeInstanceOf(Function);
      });

      it('should call the renderComponentMock', () => {
        const props = {};
        const render = { signature: 'div', props };
        const currentComponent = instance.create({ signature: 'span', props: {} });
        currentComponent.mount(instance.root);
        instance.render(render, instance.root, currentComponent);
        expect(renderComponentMock).toHaveBeenCalledTimes(1);
        expect(renderComponentMock.mock.calls[0][0]).toMatchObject({ render: { signature: 'div', props } });
        expect(renderComponentMock.mock.calls[0][1]).toEqual(instance.root);
        expect(renderComponentMock.mock.calls[0][2]).toEqual(currentComponent);
      });

      it('should call the renderChildrenMock if children are passed, or the current component has children', () => {
        const props = {};
        let render = { signature: 'div', props };
        const currentComponent = instance.create({ signature: 'span', props: {} });
        currentComponent.mount(instance.root);
        instance.render(render, instance.root, currentComponent);
        expect(renderChildrenMock).not.toHaveBeenCalled();
        render = { ...render, children: [] };
        instance.render(render, instance.root, currentComponent);
        expect(renderChildrenMock).not.toHaveBeenCalled();
        const children = [{}];
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
    });
  });
});