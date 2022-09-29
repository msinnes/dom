/**
 * @jest-environment jsdom
 */
import { DomElement } from '../DomElement';

import { DomRef } from '../DomRef';

const ref = { tagName: 'Tag' };

describe('DomElement', () => {
  it('should be a class', () => {
    expect(DomElement).toBeAClass();
  });

  describe('instance', () => {
    let documentCreateElementOriginal;
    let documentCreateElementMock;

    beforeEach(() => {
      documentCreateElementOriginal = document.createElement;
      documentCreateElementMock = jest.fn();

      document.createElement = documentCreateElementMock;
    });

    afterEach(() => {
      document.createElement = documentCreateElementOriginal;
    });

    it ('should have a ref prop', () => {
      const domRef = new DomRef(ref);
      const domElement = new DomElement(domRef);
      expect(domElement.ref).toBeDefined();
      expect(domElement.ref).toBe(domRef);
    });

    it('should pass the elem prop of a dom ref to the node.elem prop', () => {
      const domElement = new DomElement(new DomRef(ref));
      expect(domElement.elem).toEqual(ref);
    });

    it('should have a tag prop with tag in lower case', () => {
      const domElement = new DomElement(new DomRef(ref));
      expect(domElement.tag).toEqual('tag');
    });

    it('should put an element in the node.elem property', () => {
      const testString = 'string';
      documentCreateElementMock.mockImplementationOnce(() => ref);
      const domElement = new DomElement(testString);
      expect(documentCreateElementMock).toHaveBeenCalledTimes(1);
      expect(documentCreateElementMock).toHaveBeenCalledWith(testString);
      expect(domElement.elem).toEqual(ref);
      expect(domElement.tag).toEqual('tag');
    });

    describe('methods', () => {
      let instance;
      let appendChildMock;
      let removeChildMock
      let replaceChildMock;
      beforeEach(() => {
        appendChildMock = jest.fn();
        removeChildMock = jest.fn();
        replaceChildMock = jest.fn();
        const elemRef = {
          ...ref,
          appendChild: appendChildMock,
          removeChild: removeChildMock,
          replaceChild: replaceChildMock,
          style: {},
        };
        documentCreateElementMock.mockImplementationOnce(() => elemRef);
        instance = new DomElement('string');
      });

      describe('appendChild', () => {
        it('should be a function', () => {
          expect(instance.appendChild).toBeInstanceOf(Function);
        });

        it('should call the appendChild mock', () => {
          const elem = {};
          const elemRef = { elem };
          instance.appendChild(elemRef);
          expect(appendChildMock).toHaveBeenCalledTimes(1);
          expect(appendChildMock).toHaveBeenCalledWith(elem);
        });
      });

      describe('removeChild', () => {
        it('should be a function', () => {
          expect(instance.removeChild).toBeInstanceOf(Function);
        });

        it('should call the removeChild mock', () => {
          const elem = {};
          const elemRef = { elem };
          instance.removeChild(elemRef);
          expect(removeChildMock).toHaveBeenCalledTimes(1);
          expect(removeChildMock).toHaveBeenCalledWith(elem);
        });
      });

      describe('replaceChild', () => {
        it('should be a function', () => {
          expect(instance.replaceChild).toBeInstanceOf(Function);
        });

        it('should call the replaceChild mock', () => {
          const elem1 = {};
          const elemRef1 = { elem: elem1 };
          const elem2 = {};
          const elemRef2 = { elem: elem2 };

          instance.replaceChild(elemRef1, elemRef2);
          expect(replaceChildMock).toHaveBeenCalledTimes(1);
          expect(replaceChildMock).toHaveBeenCalledWith(elem1, elem2);
        });
      });

      describe('update', () => {
        let ObjectAssignMock;
        let ObjectAssignOriginal;

        beforeEach(() => {
          ObjectAssignOriginal = Object.assign;
          ObjectAssignMock = jest.fn();
          Object.assign = ObjectAssignMock;
        });

        afterEach(() => {
          Object.assign = ObjectAssignOriginal;
        });

        it('should be a function', () => {
          expect(instance.update).toBeInstanceOf(Function);
        });

        it('should call Object.assign with a separate style call', () => {
          const styleProp = {};
          const props = { style: styleProp };
          instance.update(props);
          expect(ObjectAssignMock).toHaveBeenCalledTimes(2);
          expect(ObjectAssignMock.mock.calls[0][0]).toEqual(instance.elem.style);
          expect(ObjectAssignMock.mock.calls[0][1]).toEqual(styleProp);

          expect(ObjectAssignMock.mock.calls[1][0]).toEqual(instance.elem);
          // make sure style is not assigned to element
          expect(ObjectAssignMock.mock.calls[1][1].style).toBeUndefined();
        });
      });
    });
  });
});
