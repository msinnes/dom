import { RootNode } from '@new-internal/dom';

import { DomComponent, DomParent } from '../base/DomComponent';

import { RootComponent } from '../RootComponent';

describe('RootComponent', () => {
  it('should be a class', () => {
    expect(RootComponent).toBeAClass();
  });

  it('should extend DomComponent', () => {
    expect(RootComponent).toExtend(DomComponent);
  });

  describe('instance', () => {
    let elemRef;
    let renderRef;
    let instance;

    let addValueMock;

    beforeEach(() => {
      elemRef = {};
      renderRef = {};

      instance = new RootComponent(renderRef, elemRef);

      addValueMock = jest.fn();
      instance.domContext = {
        addValue: addValueMock,
      };
    });

    it('should set the elem prop', () => {
      expect(instance.elem).toBeInstanceOf(RootNode);
      expect(instance.elem.elem).toBe(elemRef);
    });

    it('should set the root prop', () => {
      expect(instance.root).toBe(renderRef);
    });

    describe('render', () => {
      it('should be a function', () => {
        expect(instance.render).toBeInstanceOf(Function);
      });

      it('should call the super method and return the root data', () => {
        const root = instance.render();
        expect(root).toBe(renderRef);
        expect(addValueMock).toHaveBeenCalledTimes(1);
        const domParent = addValueMock.mock.calls[0][0];
        expect(domParent).toBeInstanceOf(DomParent);
        expect(domParent.node.elem).toBe(elemRef);
      });
    });
  });
});