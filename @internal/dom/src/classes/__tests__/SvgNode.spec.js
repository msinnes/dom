/**
 * @jest-environment jsdom
 */
import { SvgRef } from '../SvgRef';
import { BaseElementNode } from '../BaseElementNode';

import { SvgNode } from '../SvgNode';

const svgXmlns = 'http://www.w3.org/2000/svg';

describe('SvgNode', () => {
  it('should be a class', () => {
    expect(SvgNode).toBeAClass();
  });

  it('should extend BaseElementNode', () => {
    expect(SvgNode).toExtend(BaseElementNode);
  });

  describe('instance', () => {
    let instance;
    beforeEach(() => {
      instance = new SvgNode('div', svgXmlns);
    });

    it('should have a ref prop', () => {
      expect(instance.ref).toBeInstanceOf(SvgRef);
      const ref = new SvgRef(svgXmlns, 'div');
      instance = new SvgNode(ref, svgXmlns);
      expect(instance.ref).toBe(ref);
    });

    it('should have a tag prop with tag in lower case', () => {
      expect(instance.tag).toEqual('div');
    });

    it('should put an element in the node.elem property', () => {
      const ref = new SvgRef(svgXmlns, 'div');
      instance = new SvgNode(ref, svgXmlns);
      expect(instance.elem).toBe(ref.elem);
    });

    describe('create', () => {
      it('should be a function', () => {
        expect(instance.create).toBeInstanceOf(Function);
      });

      it('should create a DomRef if one is passed', () => {
        const svgRef = instance.create('svg', svgXmlns);
        expect(svgRef).toBeInstanceOf(SvgRef);
        expect(svgRef.elem).toBeInstanceOf(SVGElement);
      });

      it('should pass a non-string if one is passed', () => {
        const ref = {};
        const svgRef = instance.create(ref, svgXmlns);
        expect(svgRef).toBe(ref);
      });
    });

    describe('setXMLNS', () => {
      let setAttributeNSMock;

      beforeEach(() => {
        setAttributeNSMock = jest.spyOn(instance.elem, 'setAttributeNS');
      });

      it('should be a function', () => {
        expect(instance.setXMLNS).toBeInstanceOf(Function);
      });

      it('should should call the setAttributeNS mock', () => {
        instance.setXMLNS('http://www.w3.org/1999/xhtml');
        expect(setAttributeNSMock).toHaveBeenCalledTimes(1);
        expect(setAttributeNSMock).toHaveBeenCalledWith('http://www.w3.org/2000/xmlns/', 'xmlns', 'http://www.w3.org/1999/xhtml');
      });
    });


    describe('updateProps', () => {
      let setAttributeNSMock;

      beforeEach(() => {
        setAttributeNSMock = jest.spyOn(instance.elem, 'setAttributeNS');
      });

      afterEach(() => {
        jest.resetAllMocks();
      });

      it('should be a function', () => {
        expect(instance.updateProps).toBeInstanceOf(Function);
      });

      it('should call setAttribute for each property passed', () => {
        instance.updateProps({ key1: 'value1', key2: 'value2' });
        expect(setAttributeNSMock).toHaveBeenCalledTimes(2);
        expect(setAttributeNSMock).toHaveBeenCalledWith(null, 'key1', 'value1');
        expect(setAttributeNSMock).toHaveBeenCalledWith(null, 'key2', 'value2');
      });

      it('should call setXMLNS for the prop xmlns', () => {
        const setXMLNSMock = jest.spyOn(instance, 'setXMLNS').mockImplementation(() => {});
        instance.updateProps({ xmlns: 'xmlns', key1: 'value1' });
        expect(setAttributeNSMock).toHaveBeenCalledTimes(1);
        expect(setAttributeNSMock).toHaveBeenCalledWith(null, 'key1', 'value1');
        expect(setXMLNSMock).toHaveBeenCalledTimes(1);
        expect(setXMLNSMock).toHaveBeenCalledWith('xmlns');
      });

      it('should not make duplicate calls to either setAttributeNS or setXMLNS', () => {
        const setXMLNSMock = jest.spyOn(instance, 'setXMLNS');
        instance.updateProps({ xmlns: 'xmlns', key1: 'value1' });
        expect(setAttributeNSMock).toHaveBeenCalledTimes(2);
        expect(setAttributeNSMock).toHaveBeenCalledWith('http://www.w3.org/2000/xmlns/', 'xmlns', 'xmlns');
        expect(setAttributeNSMock).toHaveBeenCalledWith(null, 'key1', 'value1');
        expect(setXMLNSMock).toHaveBeenCalledTimes(1);
        expect(setXMLNSMock).toHaveBeenCalledWith('xmlns');
        instance.updateProps({ xmlns: 'xmlns', key1: 'value1' });
        expect(setAttributeNSMock).toHaveBeenCalledTimes(2);
        expect(setXMLNSMock).toHaveBeenCalledTimes(1);
      });

      it('should remove stale props', () => {
        instance.updateProps({ xmlns: 'xmlns', key1: 'value1' });
        expect(instance.elem.getAttributeNS(null, 'key1')).toEqual('value1');
        instance.updateProps({ xmlns: 'xmlns' });
        expect(instance.elem.getAttributeNS(null, 'key1')).toBe(null);
      });
    });
  });
});
