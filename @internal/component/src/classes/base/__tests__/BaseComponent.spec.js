import { BaseComponent } from '../BaseComponent';

class TestableBaseComponent extends BaseComponent {
  elem = { elem: {} };

  canUpdate() {}
  render() {}
  update() {}
}

describe('BaseComponent', () => {
  it('should be a class', () => {
    expect(BaseComponent).toBeAClass();
  });

  it('should be abstract', () => {
    expect(BaseComponent).toBeAbstract();
  });

  it('should have an abstract canUpdate method', () => {
    class CanUpdateTestableBaseComponent extends BaseComponent {
      render() {}
      update() {}
    }
    expect(CanUpdateTestableBaseComponent).toHaveAbstractMethod('canUpdate');
  });

  it('should have an abstract render method', () => {
    class RenderTestableBaseComponent extends BaseComponent {
      canUpdate() {}
      update() {}
    }
    expect(RenderTestableBaseComponent).toHaveAbstractMethod('render');
  });

  it('should have an abstract render method', () => {
    class UpdateTestableBaseComponent extends BaseComponent {
      canUpdate() {}
      render() {}
    }
    expect(UpdateTestableBaseComponent).toHaveAbstractMethod('update');
  });

  describe('instance', () => {
    let instance;
    let domContextValue;
    let domContext;

    let insertChildMock;
    let removeChildMock;
    let replaceChildMock;

    beforeEach(() => {
      insertChildMock = jest.fn();
      removeChildMock = jest.fn();
      replaceChildMock = jest.fn();
      domContextValue = {
        elem: {},
        insertChild: insertChildMock,
        removeChild: removeChildMock,
        replaceChild: replaceChildMock,
      };

      domContext = {
        value: domContextValue,
      };

      instance = new TestableBaseComponent();
      instance.domContext = domContext;
    });

    it('should have an empty array of children', () => {
      expect(instance.children).toBeInstanceOf(Array);
      expect(instance.children.length).toEqual(0);
    });

    it('should have a null parent', () => {
      expect(instance.parent).toBe(null);
    });

    it('should have component flags set to false', () => {
      expect(instance.isDomComponent).toBe(false);
      expect(instance.isSvgComponent).toBe(false);
      expect(instance.isForeignObjectComponent).toBe(false);
      expect(instance.isJSXComponent).toBe(false);
      expect(instance.isArrayComponent).toBe(false);
      expect(instance.isClassComponent).toBe(false);
      expect(instance.isElementComponent).toBe(false);
      expect(instance.isEmptyComponent).toBe(false);
      expect(instance.isFunctionComponent).toBe(false);
      expect(instance.isRootComponent).toBe(false);
      expect(instance.isTextComponent).toBe(false);
    });

    it('should have a domParent getter', () => {
      expect(instance.domParent).toBe(domContextValue);
    });

    it('should have a firstChild prop', () => {
      const child = {};
      expect(instance.firstChild).toBeUndefined();
      instance.appendChild(child);
      expect(instance.firstChild).toEqual(child);
    });

    describe('appendChild', () => {
      it('should be a function', () => {
        expect(instance.appendChild).toBeInstanceOf(Function);
      });

      it('should push items to the children array', () => {
        const child = {};
        instance.appendChild(child);
        expect(instance.children.length).toEqual(1);
        expect(instance.children[0]).toEqual(child);
      });
    });

    describe('findChildIndex', () => {
      it('should be a function', () => {
        expect(instance.findChildIndex).toBeInstanceOf(Function);
      });

      it('should find the index of a child', () => {
        const child = {};
        instance.appendChild(child);
        const idx = instance.findChildIndex(child);
        expect(idx).toEqual(0);
      });
    });

    describe('mount', () => {
      it('should be a function', () => {
        expect(instance.mount).toBeInstanceOf(Function);
      });

      it('should app a child to a parent and set the parent field', () => {
        const parent = new TestableBaseComponent();
        const appendChildMock = jest.fn();
        parent.appendChild = appendChildMock;
        instance.mount(parent);
        expect(appendChildMock).toHaveBeenCalledTimes(1);
        expect(appendChildMock).toHaveBeenCalledWith(instance);
        expect(instance.parent).toEqual(parent);
      });


      it('should append to the domParent and call the super mount if component is a dom component', () => {
        const parentAppendChild = jest.fn();
        const parent = { appendChild: parentAppendChild };
        instance.isDomComponent = true;
        instance.mount(parent);
        expect(instance.parent).toBe(parent);
        expect(parentAppendChild).toHaveBeenCalledTimes(1);
        expect(parentAppendChild).toHaveBeenCalledWith(instance);
        expect(insertChildMock).toHaveBeenCalledTimes(1);
        expect(insertChildMock).toHaveBeenCalledWith(instance.elem);
      });

      it('should not append to the domParent and call the super mount if component is not a dom component', () => {
        const parentAppendChild = jest.fn();
        const parent = { appendChild: parentAppendChild };
        instance.mount(parent);
        expect(instance.parent).toBe(parent);
        expect(parentAppendChild).toHaveBeenCalledTimes(1);
        expect(parentAppendChild).toHaveBeenCalledWith(instance);
        expect(insertChildMock).toHaveBeenCalledTimes(0);
      });
    });

    describe('removeChild', () => {
      it('should be a function', () => {
        expect(instance.removeChild).toBeInstanceOf(Function);
      });

      it('should remove a child', () => {
        const child1 = {};
        const child2 = {};
        instance.appendChild(child1);
        instance.appendChild(child2);
        instance.removeChild(child1);
        expect(instance.children.length).toEqual(1);
        expect(instance.children[0]).toEqual(child2);
      });
    });

    describe('replaceChild', () => {
      it('should be a function', () => {
        expect(instance.replaceChild).toBeInstanceOf(Function);
      });

      it('should replace a child', () => {
        const child1 = new TestableBaseComponent();
        const child2 = new TestableBaseComponent();
        const child3 = new TestableBaseComponent();

        child1.mount(instance);
        child2.mount(instance);

        instance.replaceChild(child3, child1);
        expect(instance.firstChild).toEqual(child3);
        expect(instance.children[1]).toEqual(child2);
        expect(child3.parent).toEqual(instance);
      });


      it('should replace child on the domParent and call super replaceChild if new child and old child are DomComponents', () => {
        const oldChild = new TestableBaseComponent('div');
        oldChild.domContext = domContext;
        oldChild.isDomComponent = true;
        instance.children = [oldChild];
        const newChild = new TestableBaseComponent('span');
        newChild.isDomComponent = true;
        instance.replaceChild(newChild, oldChild);
        expect(instance.firstChild).toBe(newChild);
        expect(replaceChildMock).toHaveBeenCalledTimes(1);
        expect(replaceChildMock).toHaveBeenCalledWith(newChild.elem, oldChild.elem);
      });

      it('should remove child from the domParent and call super replaceChild if oldChild is a DomComponent', () => {
        const oldChild = new TestableBaseComponent('div');
        oldChild.domContext = domContext;
        oldChild.isDomComponent = true;
        instance.children = [oldChild];
        const newChild = new TestableBaseComponent();
        instance.replaceChild(newChild, oldChild);
        expect(instance.firstChild).toBe(newChild);
        expect(removeChildMock).toHaveBeenCalledTimes(1);
        expect(removeChildMock).toHaveBeenCalledWith(oldChild.elem);
      });

      it('should insert child to the domParent and call super replace child if newChild is a DomComponent', () => {
        const oldChild = new TestableBaseComponent();
        instance.children = [oldChild];
        const newChild = new TestableBaseComponent('div');
        newChild.isDomComponent = true;
        instance.replaceChild(newChild, oldChild);
        expect(instance.firstChild).toBe(newChild);
        expect(insertChildMock).toHaveBeenCalledTimes(1);
        expect(insertChildMock).toHaveBeenCalledWith(newChild.elem);
      });
    });

    describe('unmount', () => {
      it('should be a function', () => {
        expect(instance.unmount).toBeInstanceOf(Function);
      });

      it('should remove an object from a parent', () => {
        const parent = new TestableBaseComponent();
        instance.mount(parent);
        expect(parent.children.length).toEqual(1);
        expect(instance.parent).toEqual(parent);
        instance.unmount();
        expect(parent.children.length).toEqual(0);
      });

      it('should call unmountChildren if the component has children', () => {
        const child1 = new TestableBaseComponent();
        const child2 = new TestableBaseComponent();

        child1.mount(instance);
        child2.mount(instance);

        const parent = new TestableBaseComponent();

        instance.mount(parent);
        expect(instance.children.length).toEqual(2);
        instance.unmount();
        expect(instance.children.length).toEqual(0);
      });


      it('should remove from the domParent and call the super unmount if component is a dom component', () => {
        const parentRomoveChildMock = jest.fn();
        const parent = { removeChild: parentRomoveChildMock };
        instance.parent = parent;
        instance.isDomComponent = true;
        instance.unmount();
        expect(parentRomoveChildMock).toHaveBeenCalledTimes(1);
        expect(parentRomoveChildMock).toHaveBeenCalledWith(instance);
        expect(removeChildMock).toHaveBeenCalledTimes(1);
        expect(removeChildMock).toHaveBeenCalledWith(instance.elem);
      });

      it('should not remove from the domParent and call the super unmount if component is not a dom component', () => {
        const parentRomoveChildMock = jest.fn();
        const parent = { removeChild: parentRomoveChildMock };
        instance.parent = parent;
        instance.isDomComponent = true;
        instance.unmount();
        expect(parentRomoveChildMock).toHaveBeenCalledTimes(1);
        expect(parentRomoveChildMock).toHaveBeenCalledWith(instance);
        expect(removeChildMock).toHaveBeenCalledTimes(1);
        expect(removeChildMock).toHaveBeenCalledWith(instance.elem);
      });

      it('should not call domParent removeChild if there is no parent and component is a dom component', () => {
        delete instance.domContext.value;
        instance.unmount();
        expect(removeChildMock).toHaveBeenCalledTimes(0);
      });
    });

    describe('unmountChildren', () => {
      it('should be a function', () => {
        expect(instance.unmountChildren).toBeInstanceOf(Function);
      });

      it('should unmount all children', () => {
        const child1 = new TestableBaseComponent();
        const child2 = new TestableBaseComponent();

        child1.mount(instance);
        child2.mount(instance);

        expect(instance.children.length).toEqual(2);
        instance.unmountChildren();
        expect(instance.children.length).toEqual(0);
      });

      it('should call componentWillUnmount if a child has that prop', () => {
        const child1 = new TestableBaseComponent();
        const child2 = new TestableBaseComponent();
        const componentWillUnmountMock = jest.fn();
        child1.componentWillUnmount = componentWillUnmountMock;
        child1.mount(instance);
        child2.mount(instance);

        expect(instance.children.length).toEqual(2);
        instance.unmountChildren();
        expect(instance.children.length).toEqual(0);
        expect(componentWillUnmountMock).toHaveBeenCalledTimes(1);
      });
    });
  });
});
