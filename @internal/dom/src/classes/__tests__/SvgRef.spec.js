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
    let createElementMock;
    beforeEach(() => {
      createElementMock = jest.spyOn(document, 'createElementNS');
    });

    it('should pass the ref to the elem property', () => {
      const ref = {};
      const svgRef = new SvgRef('http://www.w3.org/2000/svg', ref);
      expect(svgRef.elem).toEqual(ref);
      expect(createElementMock).not.toHaveBeenCalled();
    });

    it('should create an element if a string is passed to the constructor', () => {
      const testString = 'svg';
      const svgRef = new SvgRef('http://www.w3.org/2000/svg', testString);
      expect(createElementMock).toHaveBeenCalledTimes(1);
      expect(createElementMock).toHaveBeenCalledWith('http://www.w3.org/2000/svg', testString);
      expect(svgRef.elem).toBeInstanceOf(SVGElement);
    });
  });
});
