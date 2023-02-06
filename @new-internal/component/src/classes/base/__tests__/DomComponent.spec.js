import { createRender } from '@new-internal/render';

import { JSXComponent } from '../JSXComponent';
import { EmptyComponent } from '../../EmptyComponent';

import { DomComponent, DomParent } from '../DomComponent';

class TestableDomComponent extends DomComponent {
  elem = { elem: {} };
}

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

    let incrementMock;

    let addValueMock;
    let removeValueMock;
    beforeEach(() => {
      incrementMock = jest.fn();

      domContextValue = {
        increment: incrementMock,
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

    it('should set the correct component flags', () => {
      expect(instance.isJSXComponent).toBe(true);
      expect(instance.isDomComponent).toBe(true);
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

      it('should call domParent.increment', () => {
        instance.render();
        expect(incrementMock).toHaveBeenCalledTimes(1);
      });

      it('should not call domParent.increment if there is not domParent', () => {
        delete instance.domContext.value;
        instance.render();
        expect(incrementMock).toHaveBeenCalledTimes(0);
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
    let insertBeforeMock;
    let removeChildMock;
    let replaceChildMock;
    let instance;
    let nodeRef;
    let elemRef;
    beforeEach(() => {
      appendChildMock = jest.fn();
      insertBeforeMock = jest.fn();
      removeChildMock = jest.fn();
      replaceChildMock = jest.fn();
      elemRef = {
        appendChild: appendChildMock,
        insertBefore: insertBeforeMock,
        removeChild: removeChildMock,
        replaceChild: replaceChildMock,
        children: [],
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

    describe('increment', () => {
      it('should be a function', () => {
        expect(instance.increment).toBeInstanceOf(Function);
      });

      it('should increment the index by 1', () => {
        instance.increment();
        expect(instance.index).toBe(1);
      });
    });

    describe('insertChild', () => {
      it('should be a function', () => {
        expect(instance.insertChild).toBeInstanceOf(Function);
      });

      it('should call elem.insertBefore', () => {
        const newChildRef = { elem: {} };
        const currentChildRef = {};
        instance.elem.children = [currentChildRef];
        instance.insertChild(newChildRef);
        expect(insertBeforeMock).toHaveBeenCalledTimes(1);
        expect(insertBeforeMock).toHaveBeenCalledWith(newChildRef.elem, currentChildRef);
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
