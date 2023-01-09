import { createRender } from '@new-internal/render';

import { JSXComponent } from '../JSXComponent';
import { EmptyComponent } from '../../EmptyComponent';

import { isDomComponent, DomComponent, DomParent } from '../DomComponent';

class TestableDomComponent extends DomComponent {
  elem = { elem: {} };
}

describe('isDomComponent', () => {
  it('should be a function', () => {
    expect(isDomComponent).toBeInstanceOf(Function);
  });
});

describe('DomComponent', () => {
  it('should be a class', () => {
    expect(DomComponent).toBeAClass();
  });

  it('should be abstract', () => {
    expect(DomComponent).toBeAbstract();
  });

  it('should extend JSXComponent', () => {
    expect(DomComponent).toExtend(JSXComponent);
  });
  describe('instance', () => {
    let instance;
    let domContextValue;
    let domContext;
    let elemRef;

    let appendChildMock;
    let removeChildMock;
    let replaceChildMock;

    let addValueMock;
    let removeValueMock;
    beforeEach(() => {
      appendChildMock = jest.fn();
      removeChildMock = jest.fn();
      replaceChildMock = jest.fn();
      domContextValue = {
        appendChild: appendChildMock,
        elem: {},
        removeChild: removeChildMock,
        replaceChild: replaceChildMock,
      };

      addValueMock = jest.fn();
      removeValueMock = jest.fn();
      domContext = {
        value: domContextValue,
        addValue: addValueMock,
        removeValue: removeValueMock,
      };
      elemRef = {};
      instance = new TestableDomComponent();
      instance.domContext = domContext;
      instance.elem = { elem: elemRef };
    });

    it('should have a domParent getter', () => {
      expect(instance.domParent).toBe(domContextValue);
    });

    describe('mount', () => {
      it('should append to the domParent and call the super mount', () => {
        const parentAppendChildMock = jest.fn();
        const parent = { appendChild: parentAppendChildMock };
        instance.mount(parent);
        expect(instance.parent).toBe(parent);
        expect(parentAppendChildMock).toHaveBeenCalledTimes(1);
        expect(parentAppendChildMock).toHaveBeenCalledWith(instance);
        expect(appendChildMock).toHaveBeenCalledTimes(1);
        expect(appendChildMock).toHaveBeenCalledWith(instance.elem);
      });
    });

    describe('replaceChild', () => {
      it('should replace child on the domParent and call super replaceChild if new child and old child are DomComponents', () => {
        const oldChild = new TestableDomComponent('div');
        oldChild.domContext = domContext;
        instance.children = [oldChild];
        const newChild = new TestableDomComponent('span');
        instance.replaceChild(newChild, oldChild);
        expect(instance.firstChild).toBe(newChild);
        expect(replaceChildMock).toHaveBeenCalledTimes(1);
        expect(replaceChildMock).toHaveBeenCalledWith(newChild.elem, oldChild.elem);
      });

      it('should remove child from the domParent and call super replaceChild if oldChild is a DomComponent', () => {
        const oldChild = new TestableDomComponent('div');
        oldChild.domContext = domContext;
        instance.children = [oldChild];
        const newChild = new EmptyComponent();
        instance.replaceChild(newChild, oldChild);
        expect(instance.firstChild).toBe(newChild);
        expect(removeChildMock).toHaveBeenCalledTimes(1);
        expect(removeChildMock).toHaveBeenCalledWith(oldChild.elem);
      });

      it('should append child to the domParen and call super replace child if newChild is a DomComponent', () => {
        const oldChild = new EmptyComponent();
        instance.children = [oldChild];
        const newChild = new TestableDomComponent('div');
        instance.replaceChild(newChild, oldChild);
        expect(instance.firstChild).toBe(newChild);
        expect(appendChildMock).toHaveBeenCalledTimes(1);
        expect(appendChildMock).toHaveBeenCalledWith(newChild.elem);
      });
    });

    describe('render', () => {
      it('should be a function', () => {
        expect(instance.render).toBeInstanceOf(Function);
      });

      it('should add the elem to the domContext inside a DomParent', () => {
        instance.render();
        expect(addValueMock).toHaveBeenCalledTimes(1);
        const domParent = addValueMock.mock.calls[0][0];
        expect(domParent).toBeInstanceOf(DomParent);
        expect(domParent.elem).toBe(instance.elem.elem);
      });
    });

    describe('unmount', () => {
      it('should remove from the domParent and call the super unmount', () => {
        const parentRomoveChildMock = jest.fn();
        const parent = { removeChild: parentRomoveChildMock };
        instance.parent = parent;
        instance.unmount();
        expect(parentRomoveChildMock).toHaveBeenCalledTimes(1);
        expect(parentRomoveChildMock).toHaveBeenCalledWith(instance);
        expect(removeChildMock).toHaveBeenCalledTimes(1);
        expect(removeChildMock).toHaveBeenCalledWith(instance.elem);
      });
    });

    describe('unmountChildren', () => {
      it('should set the domContext value, call the super method, and remove the context value', () => {
        const unmountMock = jest.fn();
        const firstChild = { unmount: unmountMock };
        const secondChild = { unmount: unmountMock };
        instance.children = [firstChild, secondChild];
        instance.unmountChildren();
        expect(addValueMock).toHaveBeenCalledTimes(1);
        const domParent = addValueMock.mock.calls[0][0];
        expect(domParent).toBeInstanceOf(DomParent);
        expect(domParent.node).toBe(instance.elem);
        expect(unmountMock).toHaveBeenCalledTimes(2);
        expect(removeValueMock).toHaveBeenCalledTimes(1);
      });
    });
  });
});

describe('DomParent', () => {
  it('should be a class', () => {
    expect(DomParent).toBeAClass();
  });

  describe('instance', () => {
    let appendChildMock;
    let removeChildMock;
    let replaceChildMock;
    let instance;
    let nodeRef;
    let elemRef;
    beforeEach(() => {
      appendChildMock = jest.fn();
      removeChildMock = jest.fn();
      replaceChildMock = jest.fn();
      elemRef = {
        appendChild: appendChildMock,
        removeChild: removeChildMock,
        replaceChild: replaceChildMock,
      };
      nodeRef = {
        elem: elemRef,
      };
      instance = new DomParent(nodeRef);
    });

    it('should have a node prop', () => {
      expect(instance.node).toBe(nodeRef);
    });

    it('should have an elem getter', () => {
      expect(instance.elem).toBe(elemRef);
    });

    it('should have an index props set to 0', () => {
      expect(instance.index).toBe(0);
    });

    describe('appendChild', () => {
      it('should be a function', () => {
        expect(instance.appendChild).toBeInstanceOf(Function);
      });

      it('should call elem.appendChild', () => {
        const child = { elem: {} };
        instance.appendChild(child);
        expect(appendChildMock).toHaveBeenCalledTimes(1);
        expect(appendChildMock).toHaveBeenCalledWith(child.elem);
      });
    });

    describe('increment', () => {
      it('should be a function', () => {
        expect(instance.increment).toBeInstanceOf(Function);
      });

      it('should increment the index by 1', () => {
        instance.increment();
        expect(instance.index).toBe(1);
      });
    });

    describe('removeChild', () => {
      it('should be a function', () => {
        expect(instance.removeChild).toBeInstanceOf(Function);
      });

      it('should call elem.removeChild', () => {
        const child = { elem: {} };
        instance.removeChild(child);
        expect(removeChildMock).toHaveBeenCalledTimes(1);
        expect(removeChildMock).toHaveBeenCalledWith(child.elem);
      });
    });

    describe('replaceChild', () => {
      it('should be a function', () => {
        expect(instance.replaceChild).toBeInstanceOf(Function);
      });

      it('should call elem.replaceChild', () => {
        const newChild = { elem: {} };
        const oldChild = { elem: {} };
        instance.replaceChild(newChild, oldChild);
        expect(replaceChildMock).toHaveBeenCalledTimes(1);
        expect(replaceChildMock).toHaveBeenCalledWith(newChild.elem, oldChild.elem);
      });
    });
  });
});
