/**
 * @jest-environment jsdom
 */
import { DomRef } from '@new-internal/dom';

import { isJsxRender, isElementRender } from '../isJsxRender';

describe('isJsxRender', () => {
  it('should be a function', () => {
    expect(isJsxRender).toBeInstanceOf(Function);
  });

  it('should return false if the input is not an object literal', () => {
    expect(isJsxRender('string')).toBe(false);
    expect(isJsxRender([])).toBe(false);
    expect(isJsxRender(() => {})).toBe(false);
  });

  it('should return true if signature is a function or class', () => {
    expect(isJsxRender({ signature: () => {} })).toBe(true);
    expect(isJsxRender({ signature: class {} })).toBe(true);
  });

  it('should return false if the signature is not a function or class', () => {
    expect(isJsxRender({})).toBe(false);
    expect(isJsxRender({ signature: 1 })).toBe(false);
    expect(isJsxRender({ signature: new Date() })).toBe(false);
  });

  it('should return true if props is not passed or if props is an object literal', () => {
    expect(isJsxRender({ signature: () => {} })).toBe(true);
    expect(isJsxRender({ signature: () => {}, props: {} })).toBe(true);
  });

  it('should return false if props is not an object literal', () => {
    expect(isJsxRender({ signature: () => {}, props: 'props' })).toBe(false);
    expect(isJsxRender({ signature: () => {}, props: () => {}})).toBe(false);
  });

  it('should return true if children is not passed or if children is an array', () => {
    expect(isJsxRender({ signature: () => {} })).toBe(true);
    expect(isJsxRender({ signature: () => {}, children: [] }));
  });

  it('should return false if children is not an array', () => {
    expect(isJsxRender({ signature: () => {}, children: 'children' })).toBe(false);
    expect(isJsxRender({ signature: () => {}, children: {} })).toBe(false);
  });
});

describe('isElementRender', () => {
  it('should be a function', () => {
    expect(isElementRender).toBeInstanceOf(Function);
  });

  it('should return false if the input is not an object literal', () => {
    expect(isElementRender('string')).toBe(false);
    expect(isElementRender([])).toBe(false);
    expect(isElementRender(() => {})).toBe(false);
  });

  it('should return true if signature is a string or DomRef', () => {
    expect(isElementRender({ signature: 'div' })).toBe(true);
    expect(isElementRender({ signature: new DomRef('div') })).toBe(true);
  });

  it('should return false if the signature is not a string or DomRef', () => {
    expect(isElementRender({})).toBe(false);
    expect(isElementRender({ signature: 1 })).toBe(false);
    expect(isElementRender({ signature: new Date() })).toBe(false);
  });

  it('should return true if props is not passed or if props is an object literal', () => {
    expect(isElementRender({ signature: 'div' })).toBe(true);
    expect(isElementRender({ signature: 'div', props: {} })).toBe(true);
  });

  it('should return false if props is not an object literal', () => {
    expect(isElementRender({ signature: 'div', props: 'props' })).toBe(false);
    expect(isElementRender({ signature: 'div', props: () => {}})).toBe(false);
  });

  it('should return true if children is not passed or if children is an array', () => {
    expect(isElementRender({ signature: 'div' })).toBe(true);
    expect(isElementRender({ signature: 'div', children: [] }));
  });

  it('should return false if children is not an array', () => {
    expect(isElementRender({ signature: 'div', children: 'children' })).toBe(false);
    expect(isElementRender({ signature: 'div', children: {} })).toBe(false);
  });
});
