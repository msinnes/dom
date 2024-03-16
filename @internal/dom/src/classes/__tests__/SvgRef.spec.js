/**
 * @jest-environment jsdom
 */
import { SvgRef } from '../SvgRef';

describe('SvgRef', () => {
  afterEach(jest.resetAllMocks);

  it('should be a class', () => {
    expect(SvgRef).toBeAClass();
  });

  describe('instance', () => {
    let ref;
    let createElementMock;
    beforeEach(() => {
      ref = {};
      createElementMock = jest.spyOn(document, 'createElementNS').mockImplementation(() => ref);
    });

    it('should pass the ref to the elem property', () => {
      const svgRef = new SvgRef(ref);
      expect(svgRef.elem).toEqual(ref);
      expect(createElementMock).not.toHaveBeenCalled();
    });

    it('should create an element if a string is passed to the constructor', () => {
      const testString = 'string';
      const svgRef = new SvgRef(testString);
      expect(createElementMock).toHaveBeenCalledTimes(1);
      expect(createElementMock).toHaveBeenCalledWith('http://www.w3.org/2000/svg', testString);
      expect(svgRef.elem).toEqual(ref);
    });

    it('should override the default svg namespace if one is passed', () => {
      const testString = 'string';
      const testXmlns = 'namespace';
      const svgRef = new SvgRef(testString, testXmlns);
      expect(createElementMock).toHaveBeenCalledTimes(1);
      expect(createElementMock).toHaveBeenCalledWith(testXmlns, testString);
      expect(svgRef.elem).toEqual(ref);
    });
  });
});
