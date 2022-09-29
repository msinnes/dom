/**
 * @jest-environment jsdom
 */
import { DomRef } from '../DomRef';

const ref = {};

describe('DomRef', () => {
  it('should be a class', () => {
    expect(DomRef).toBeAClass();
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

    it('should pass the ref to the elem property', () => {
      const domRef = new DomRef(ref);
      expect(domRef.elem).toEqual(ref);
    });

    it('should create an element if a string is passed to the constructor', () => {
      const testString = 'string';
      documentCreateElementMock.mockImplementationOnce(() => ref);
      const domRef = new DomRef(testString);
      expect(documentCreateElementMock).toHaveBeenCalledTimes(1);
      expect(documentCreateElementMock).toHaveBeenCalledWith(testString);
      expect(domRef.elem).toEqual(ref);
    });
  });
});
