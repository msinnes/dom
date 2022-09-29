/**
 * @jest-environment jsdom
 */
import { BaseComponent } from '@internal/base/BaseComponent';

import { ArrayComponent, DomComponent, StringComponent } from '../DomComponent';
import { DomElement } from '../DomElement';
import { DomRender } from '../DomRender';

describe('ArrayComponent', () => {
  it('should be a class', () => {
    expect(ArrayComponent).toBeAClass();
  });

  it('should extend BaseComponent', () => {
    expect(ArrayComponent).toExtend(BaseComponent);
  });

  describe('instance', () => {
    let instance;
    let elemsRef;

    beforeEach(() => {
      elemsRef = [];
      instance = new ArrayComponent(elemsRef);
    });

    it('should set the input array on the elems prop', () => {
      expect(instance.elems).toBe(elemsRef);
    });

    it('should append it\'s children to it\'s parent dom', () => {
      const parent = new DomComponent({ signature: 'div' });
      const appendChildMock = jest.fn();
      instance.mount(parent);
      parent.elem.appendChild = appendChildMock;
      const child = { elem: document.createElement('div') };
      instance.appendChild(child);
      expect(appendChildMock).toHaveBeenCalledTimes(1);
      expect(appendChildMock).toHaveBeenCalledWith(child.elem);
    });

    it('should remove it\'s children from it\'s parent dom', () => {
      const parent = new DomComponent({ signature: 'div' });
      const removeChildMock = jest.fn();
      instance.mount(parent);
      parent.elem.removeChild = removeChildMock;
      const child = { elem: document.createElement('div') };
      instance.removeChild(child);
      expect(removeChildMock).toHaveBeenCalledTimes(1);
      expect(removeChildMock).toHaveBeenCalledWith(child.elem);
    });

    it('should replace it\'s children from it\'s parent dom and unmount the children', () => {
      const parent = new DomComponent({ signature: 'div' });
      const replaceChildMock = jest.fn();
      const unmountChildrenMock = jest.fn();
      instance.mount(parent);
      parent.elem.replaceChild = replaceChildMock;
      const child1 = { elem: document.createElement('div') };
      const child2 = { elem: document.createElement('div'), unmountChildren: unmountChildrenMock };
      instance.replaceChild(child1, child2);
      expect(replaceChildMock).toHaveBeenCalledTimes(1);
      expect(unmountChildrenMock).toHaveBeenCalledTimes(1);
      expect(replaceChildMock).toHaveBeenCalledWith(child1.elem, child2.elem);
    });

    describe('canUpdate', () => {
      it('should be a function', () => {
        expect(instance.canUpdate).toBeInstanceOf(Function);
      });

      it('should be able to update if the next render is an array render', () => {
        let render = new DomRender([]);
        expect(instance.canUpdate(render)).toBe(true);
        render = new DomRender('string');
        expect(instance.canUpdate(render)).toBe(false);
        render = new DomRender({ signature: 'div', props: {} });
        expect(instance.canUpdate(render)).toBe(false);
      });
    });

    describe('update', () => {
      it('should be a function', () => {
        expect(instance.update).toBeInstanceOf(Function);
      });

      it('should update the elems prop', () => {
        const newElems = [];
        instance.update(newElems);
        expect(instance.elems).toBe(newElems);
      });
    });
  });
});

describe('StringComponent', () => {
  let documentCreateTextNodeOriginal;
  let documentCreateTextNodeMock;
  let replaceTextMock;
  let textNodeRef;
  beforeEach(() => {
    documentCreateTextNodeOriginal = document.createTextNode;
    documentCreateTextNodeMock = jest.fn();
    replaceTextMock = jest.fn();
    textNodeRef = {
      replaceWholeText: replaceTextMock,
    };
    documentCreateTextNodeMock.mockImplementation(() => textNodeRef);
    document.createTextNode = documentCreateTextNodeMock;
  });

  afterEach(() => {
    jest.resetAllMocks();
    document.createTextNode = documentCreateTextNodeOriginal;
  });

  it('should be a class', () => {
    expect(StringComponent).toBeAClass();
  });

  it('should extend BaseComponent', () => {
    expect(StringComponent).toExtend(BaseComponent);
  });

  describe('instance', () => {
    let instance;

    beforeEach(() => {
      instance = new StringComponent('text');
    });

    it('should create a text node on the elem prop', () => {
      expect(documentCreateTextNodeMock).toHaveBeenCalledTimes(1);
      expect(documentCreateTextNodeMock).toHaveBeenCalledWith('text');

      expect(instance.elem.elem).toBe(textNodeRef);
      expect(instance.text).toBe('text');
    });

    describe('canUpdate', () => {
      it('should be a function', () => {
        expect(instance.canUpdate).toBeInstanceOf(Function);
      });

      it('should be able to update if the next render is a string render', () => {
        let render = new DomRender('string');
        expect(instance.canUpdate(render)).toBe(true);
        render = new DomRender([]);
        expect(instance.canUpdate(render)).toBe(false);
        render = new DomRender({ signature: 'div', props: {} });
        expect(instance.canUpdate(render)).toBe(false);
      });
    });

    describe('update', () => {
      it('should be a function', () => {
        expect(instance.update).toBeDefined();
        expect(instance.update).toBeInstanceOf(Function);
      });

      it('should call replace whole text on the text node', () => {
        instance.update('new text');
        expect(instance.elem.elem.textContent).toEqual('new text');
      });
    });
  });
});

describe('DomComponent', () => {
  it('should be a class', () => {
    expect(DomComponent).toBeAClass();
  });

  it('should extend BaseComponent', () => {
    expect(DomComponent).toExtend(BaseComponent);
  });

  describe('instance', () => {
    let instance;

    beforeEach(() => {
      instance = new DomComponent({ signature: 'div', props: { innerText: 'text' } });
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should call update on create', () => {
      expect(instance.elem.elem.innerText).toEqual('text');
    });

    it('should have an elem prop', () => {
      expect(instance.elem).toBeDefined();
      expect(instance.elem).toBeInstanceOf(DomElement);
    });

    it('should have a lower case tag prop', () => {
      expect(instance.tag).toBeDefined();
      expect(instance.tag).toEqual('div');
    });

    describe('appendChild', () => {
      it('should call the element.appendChild and add a child', () => {
        const child = new DomComponent({ signature: 'div' });
        const appendMock = jest.fn();
        instance.elem.appendChild = appendMock;
        instance.appendChild(child);
        expect(instance.children[0]).toEqual(child);
        expect(appendMock).toHaveBeenCalledTimes(1);
        expect(appendMock).toHaveBeenCalledWith(child.elem);
      });

      it('should not call if element.appendChild if the input is an ArrayComponent', () => {
        const child = new ArrayComponent([new DomComponent({ signature: 'div' })]);
        const appendMock = jest.fn();
        instance.elem.appendChild = appendMock;
        instance.appendChild(child);
        expect(instance.children[0]).toEqual(child);
        expect(appendMock).not.toHaveBeenCalled();
      });
    });

    describe('canUpdate', () => {
      it('should be a function', () => {
        expect(instance.canUpdate).toBeInstanceOf(Function);
      });

      it('should be able to update if the next signature is the same', () => {
        let render = new DomRender({ signature: 'div', props: {} });
        expect(instance.canUpdate(render)).toBe(true);
        render = new DomRender({ signature: 'p', props: {} });
        expect(instance.canUpdate(render)).toBe(false);
        render = new DomRender('string');
        expect(instance.canUpdate(render)).toBe(false);
        render = new DomRender([]);
        expect(instance.canUpdate(render)).toBe(false);
      });
    });

    describe('update', () => {
      it('should be a function', () => {
        expect(instance.update).toBeInstanceOf(Function);
      });

      it('should call the elem.update function', () => {
        const props = {};
        const updateMock = jest.fn();
        instance.elem.update = updateMock;
        instance.update(props);
        expect(updateMock).toHaveBeenCalledTimes(1);
        expect(updateMock).toHaveBeenCalledWith(props);
      });
    });

    describe('removeChild', () => {
      it('should call the element.removeChild and remove the child', () => {
        const child = new DomComponent({ signature: 'div' });
        const removeMock = jest.fn();
        instance.elem.removeChild = removeMock;
        instance.appendChild(child);
        expect(instance.children[0]).toEqual(child);
        instance.removeChild(child);
        expect(instance.children.length).toEqual(0);
        expect(removeMock).toHaveBeenCalledTimes(1);
        expect(removeMock).toHaveBeenCalledWith(child.elem);
      });

      it('should not call element.removeChild if the input is an ArrayInput', () => {
        const child = new ArrayComponent([new DomComponent({ signature: 'div' })]);
        const removeMock = jest.fn();
        instance.elem.removeChild = removeMock;
        instance.appendChild(child);
        expect(instance.children[0]).toEqual(child);
        instance.removeChild(child);
        expect(instance.children.length).toEqual(0);
        expect(removeMock).not.toHaveBeenCalled();
      });
    });

    describe('replaceChild', () => {
      it('should call the element.replaceChild and replace the child', () => {
        const child1 = new DomComponent({ signature: 'div' });
        const child2 = new DomComponent({ signature: 'div' });
        const replaceMock = jest.fn();
        instance.elem.replaceChild = replaceMock;
        instance.appendChild(child1);
        expect(instance.children[0]).toEqual(child1);
        instance.replaceChild(child2, child1);
        expect(instance.children.length).toEqual(1);
        expect(instance.children[0]).toEqual(child2);
        expect(replaceMock).toHaveBeenCalledTimes(1);
        expect(replaceMock).toHaveBeenCalledWith(child2.elem, child1.elem);
      });

      it('should not call element.replaceChild if any input is an ArrayInput', () => {
        const child1 = new ArrayComponent([new DomComponent({ signature: 'div' })]);
        const child2 = new DomComponent({ signature: 'div' });
        const replaceMock = jest.fn();
        instance.elem.replaceChild = replaceMock;
        instance.appendChild(child1);
        expect(instance.children[0]).toEqual(child1);
        instance.replaceChild(child2, child1);
        expect(instance.children.length).toEqual(1);
        expect(instance.children[0]).toEqual(child2);
        expect(replaceMock).not.toHaveBeenCalled();
        instance.replaceChild(child1, child2);
        expect(instance.children.length).toEqual(1);
        expect(instance.children[0]).toEqual(child1);
        expect(replaceMock).not.toHaveBeenCalled();
      });
    });
  });
});
