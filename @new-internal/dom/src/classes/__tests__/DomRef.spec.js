/**
 * @jest-environment jsdom
 */
import { DomRef } from '../DomRef';

describe('DomRef', () => {
  it('should be a class', () => {
    expect(DomRef).toBeAClass();
  });

  describe('instance', () => {
    let ref;
    let createElementMock;
    beforeEach(() => {
      ref = {};
      createElementMock = jest.spyOn(document, 'createElement').mockImplementation(() => ref);
    });

    it('should pass the ref to the elem property', () => {
      const domRef = new DomRef(ref);
      expect(domRef.elem).toEqual(ref);
      expect(createElementMock).not.toHaveBeenCalled();
    });

    it('should create an element if a string is passed to the constructor', () => {
      const testString = 'string';
      const domRef = new DomRef(testString);
      expect(createElementMock).toHaveBeenCalledTimes(1);
      expect(createElementMock).toHaveBeenCalledWith(testString);
      expect(domRef.elem).toEqual(ref);
    });
  });
});