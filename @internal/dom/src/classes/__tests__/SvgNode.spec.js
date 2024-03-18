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
      const ref = new SvgRef('div');
      instance = new SvgNode(ref);
      expect(instance.ref).toBe(ref);
    });

    it('should have a tag prop with tag in lower case', () => {
      expect(instance.tag).toEqual('div');
    });

    it('should put an element in the node.elem property', () => {
      const ref = new SvgRef('div');
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


    describe('update', () => {
      let setAttributeMock;

      beforeEach(() => {
        setAttributeMock = jest.spyOn(instance.elem, 'setAttribute');
      });

      it('should be a function', () => {
        expect(instance.update).toBeInstanceOf(Function);
      });

      it('should call setAttribute for each property passed', () => {
        instance.update({ key1: 'value1', key2: 'value2' });
        expect(setAttributeMock).toHaveBeenCalledTimes(2);
        expect(setAttributeMock).toHaveBeenCalledWith('key1', 'value1');
        expect(setAttributeMock).toHaveBeenCalledWith('key2', 'value2');
      });
    });
  });
});
