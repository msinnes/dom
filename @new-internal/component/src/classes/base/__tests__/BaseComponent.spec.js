import { BaseComponent } from '../BaseComponent';

class TestableBaseComponent extends BaseComponent {
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

    beforeEach(() => {
      instance = new TestableBaseComponent();
    });

    it('should have an empty array of children', () => {
      expect(instance.children).toBeInstanceOf(Array);
      expect(instance.children.length).toEqual(0);
    });

    it('should have a null parent', () => {
      expect(instance.parent).toBe(null);
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
    });
  });
});