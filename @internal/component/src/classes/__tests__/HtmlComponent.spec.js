/**
 * @jest-environment jsdom
 */
import { createRender } from '@internal/render';
import { HtmlNode } from '@internal/dom';

import { BaseElementComponent } from '../base/BaseElementComponent';
import { DomParent } from '../base/DomComponent';

import { HtmlComponent } from '../HtmlComponent';

describe('HtmlComponent', () => {
  it('should be a class', () => {
    expect(HtmlComponent).toBeAClass();
  });

  it('should extend BaseElementComponent', () => {
    expect(HtmlComponent).toExtend(BaseElementComponent);
  });

  describe('instance', () => {
    let instance;
    let props;
    let domContextRef;
    let addValueMock;
    beforeEach(() => {
      props = {};
      addValueMock = jest.fn();
      domContextRef = {
        addValue: addValueMock,
        value: {
          increment: () => {},
        },
      };
      instance = new HtmlComponent('div', props);
      instance.domContext = domContextRef;
    });

    it('should set the correct component flags', () => {
      expect(instance.isJSXComponent).toBe(true);
      expect(instance.isDomComponent).toBe(true);
      expect(instance.isElementComponent).toBe(true);
    });

    it('should have a signature prop', () => {
      expect(instance.signature).toEqual('div');
    });

    it('should have a props prop', () => {
      expect(instance.props).toEqual(props);
    });

    it('should have an elem prop', () => {
      expect(instance.elem).toBeInstanceOf(HtmlNode);
      expect(instance.elem.tag).toEqual('div');
    });

    describe('canUpdate', () => {
      it('should be a function', () => {
        expect(instance.canUpdate).toBeInstanceOf(Function);
      });

      it('should be able to update if the next render is an element render', () => {
        let render = createRender({ signature: 'div', props: {} });
        expect(instance.canUpdate(render)).toBe(true);
        render = createRender({ signature: 'p', props: {} });
        expect(instance.canUpdate(render)).toBe(false);
        render = createRender('string');
        expect(instance.canUpdate(render)).toBe(false);
        render = createRender([]);
        expect(instance.canUpdate(render)).toBe(false);
        render = createRender();
        expect(instance.canUpdate(render)).toBe(false);
      });
    });

    describe('render', () => {
      it('should be a function', () => {
        expect(instance.render).toBeInstanceOf(Function);
      });

      it('should return a render object with the form: { signature: element, props: {}, children: [] }', () => {
        expect(instance.render()).toMatchObject({ signature: 'div', props, children: [] });
      });

      it('should call the super.render method', () => {
        instance.render();
        expect(addValueMock).toHaveBeenCalledTimes(1);
        const domParent = addValueMock.mock.calls[0][0];
        expect(domParent).toBeInstanceOf(DomParent);
        expect(domParent.node.tag).toBe('div');
      });
    });

    describe('update', () => {
      it('should be a function', () => {
        expect(instance.update).toBeInstanceOf(Function);
      });

      it('should update instance props', () => {
        const newProps = {};
        instance.update(newProps);
        expect(instance.props).toBe(newProps);
      });
    });
  });
});
