/**
 * @jest-environment jsdom
 */
import { TextRef } from '../TextRef';

describe('TextRef', () => {
  it('should be a class', () => {
    expect(TextRef).toBeAClass();
  });

  describe('instance', () => {
    let ref;
    let createTextNodeMock;
    beforeEach(() => {
      ref = {};
      createTextNodeMock = jest.spyOn(document, 'createTextNode').mockImplementation(() => ref);
    });

    it('should create an element if a string is passed to the constructor', () => {
      const testString = 'string';
      const textRef = new TextRef(testString);
      expect(createTextNodeMock).toHaveBeenCalledTimes(1);
      expect(createTextNodeMock).toHaveBeenCalledWith(testString);
      expect(textRef.elem).toEqual(ref);
    });
  });
});
