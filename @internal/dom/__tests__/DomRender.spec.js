/**
 * @jest-environment jsdom
 */
import { BaseRender } from '@internal/base/BaseRender';

import { DomRender } from '../DomRender';

import { DomRef } from '../DomRef';

describe('DomRender', () => {
  it('should be a class', () => {
    expect(DomRender).toBeAClass();
  });

  it('should extend BaseRender', () => {
    expect(DomRender).toExtend(BaseRender);
  });

  describe('instance', () => {
    let instance;

    beforeEach(() => {
      instance = new DomRender({ signature: 'div' });
    });

    describe('filterArrayChildren', () => {
      it('should be a function', () => {
        expect(instance.filterArrayChildren).toBeInstanceOf(Function);
      });

      it('should filter empty arrays from array renders and render children', () => {
        let result = instance.filterArrayChildren([[]]);
        expect(result.length).toEqual(0);
        result = instance.filterArrayChildren([[]]);
        expect(result.length).toEqual(0);
        result = instance.filterArrayChildren([['one']]);
        expect(result.length).toEqual(1);
      });

      it('should filter empty strings and whitespace-only strings from array renders and render children', () => {
        let result = instance.filterArrayChildren(['']);
        expect(result.length).toEqual(0);
        result = instance.filterArrayChildren(['   ']);
        expect(result.length).toEqual(0);
        expect(result.length).toEqual(0);
        result = instance.filterArrayChildren(['   s']);
        expect(result.length).toEqual(1);
      });

      it('should filter null and undefined children', () => {
        let result = instance.filterArrayChildren([null]);
        expect(result.length).toEqual(0);
        result = instance.filterArrayChildren([undefined]);
        expect(result.length).toEqual(0);
      });
    });

    describe('validateSignature', () => {
      it('should be a function', () => {
        expect(instance.validateSignature).toBeInstanceOf(Function);
      });

      it('should return true if the input is a non-empty string or a DomRef', () => {
        expect(instance.validateSignature('string')).toBe(true);
        expect(instance.validateSignature(new DomRef('div'))).toBe(true);
        expect(instance.validateSignature('')).toBe(false);
        expect(instance.validateSignature(1)).toBe(false);
      });
    });
  });
});

