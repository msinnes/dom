/**
 * @jest-environment jsdom
 */
import { BaseRender } from '@internal/base/BaseRender';
import { DomRef } from '@internal/dom/DomRef';

import { AppRender } from '../AppRender';

describe('AppRender', () => {
  it('should be a class', () => {
    expect(AppRender).toBeAClass();
  });

  it('should extend BaseRenderer', () => {
    expect(AppRender).toExtend(BaseRender);
  });

  describe('instance', () => {
    let instance;

    beforeEach(() => {
      instance = new AppRender({ signature: 'div' });
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
    });

    describe('validateSignature', () => {
      it('should be a function', () => {
        expect(instance.validateSignature).toBeInstanceOf(Function);
      });

      it('should return true if the input is a non-empty string, DomRef, or a function', () => {
        expect(instance.validateSignature('string')).toBe(true);
        expect(instance.validateSignature(new DomRef('div'))).toBe(true);
        expect(instance.validateSignature('')).toBe(false);
        expect(instance.validateSignature(1)).toBe(false);
      });
    });

    describe('getRenderableRender', () => {
      it('should be a function', () => {
        const testInstance = new AppRender();
        expect(testInstance.getRenderableRender).toBeInstanceOf(Function);
      });

      it('should return the correct render', () => {
        let testInstance = new AppRender({ signature: 'div', props: {}, children: [] });
        expect(testInstance.getRenderableRender()).toMatchObject({
          render: {
            signature: 'div',
            props: {
              children: [],
            },
          }
        });
        testInstance = new AppRender('text');
        expect(testInstance.getRenderableRender()).toBe(testInstance);
        const arrayRef = [];
        testInstance = new AppRender(arrayRef);
        expect(testInstance.getRenderableRender()).toBe(testInstance);
        testInstance = new AppRender();
        expect(testInstance.getRenderableRender()).toBe(testInstance);
        testInstance = new AppRender(null);
        expect(testInstance.getRenderableRender()).toBe(testInstance);
      });
    });
  });
});

