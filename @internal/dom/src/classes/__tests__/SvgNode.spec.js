/**
 * @jest-environment jsdom
 */
import { SvgRef } from '../SvgRef';
import { BaseElementNode } from '../BaseElementNode';

import { SvgNode } from '../SvgNode';

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
      instance = new SvgNode('div');
    });

    it('should have a ref prop', () => {
      expect(instance.ref).toBeInstanceOf(SvgRef);
      const ref = new SvgRef('http://www.w3.org/2000/svg', 'div');
      instance = new SvgNode(ref);
      expect(instance.ref).toBe(ref);
    });

    it('should have a tag prop with tag in lower case', () => {
      expect(instance.tag).toEqual('div');
    });

    it('should put an element in the node.elem property', () => {
      const ref = new SvgRef('http://www.w3.org/2000/svg', 'div');
      instance = new SvgNode(ref);
      expect(instance.elem).toBe(ref.elem);
    });

    describe('create', () => {
      it('should be a function', () => {
        expect(instance.create).toBeInstanceOf(Function);
      });

      it('should create a DomRef if one is passed', () => {
        const svgRef = instance.create('svg');
        expect(svgRef).toBeInstanceOf(SvgRef);
        expect(svgRef.elem).toBeInstanceOf(SVGElement);
      });

      it('should pass a non-string if one is passed', () => {
        const ref = {};
        const svgRef = instance.create(ref);
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
    });
  });
});
