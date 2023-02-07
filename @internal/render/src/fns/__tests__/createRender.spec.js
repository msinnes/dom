/**
 * @jest-environment jsdom
 */
import { DomRef } from '@internal/dom';

import { TextRender } from '../../classes/TextRender';
import { EmptyRender } from '../../classes/EmptyRender';
import { ArrayRender } from '../../classes/ArrayRender';
import { JSXRender } from '../../classes/JSXRender';
import { ElementRender } from '../../classes/ElementRender';

import { createRender } from '../createRender';

describe('createRender', () => {
  it('should be a function', () => {
    expect(createRender).toBeInstanceOf(Function);
  });

  it('should return an empty render if the input is undefined, null, or an empty string', () => {
    expect(createRender()).toBeInstanceOf(EmptyRender);
    expect(createRender(null)).toBeInstanceOf(EmptyRender);
    expect(createRender('')).toBeInstanceOf(EmptyRender);
  });

  it('should create a string render if the input is a string', () => {
    expect(createRender('string')).toBeInstanceOf(TextRender);
  });

  it('should return an array render if the input is an array', () => {
    expect(createRender([])).toBeInstanceOf(ArrayRender);
  });

  it('should return a jsx render if the input is a valid jsx render', () => {
    expect(createRender({ signature: () => {}, props: {} })).toBeInstanceOf(JSXRender);
    expect(createRender({ signature: class {}, children: [] })).toBeInstanceOf(JSXRender);
  });

  it('should return a dom render if the input is a valid dom render', () => {
    expect(createRender({ signature: 'div', props: {} })).toBeInstanceOf(ElementRender);
    expect(createRender({ signature: new DomRef('div'), children: [] })).toBeInstanceOf(ElementRender);
  });

  it('should log a warning and return an empty render if the input render is a function', () => {
    const consoleWarnMock = jest.fn();
    const consoleWarnOriginal = console.warn;
    const warningMessage = 'ImplementationWarning: Function components must be executed and will not render to the DOM.';
    console.warn = consoleWarnMock;
    let out = createRender(() => {});
    expect(out).toBeInstanceOf(EmptyRender);
    expect(out.render).toBe(null);
    expect(consoleWarnMock).toHaveBeenCalledTimes(1);
    expect(consoleWarnMock).toHaveBeenCalledWith(warningMessage);
    out = createRender(function () {});
    expect(out).toBeInstanceOf(EmptyRender);
    expect(out.render).toBe(null);
    expect(consoleWarnMock).toHaveBeenCalledTimes(2);
    expect(consoleWarnMock).toHaveBeenCalledWith(warningMessage);
    console.warn = consoleWarnOriginal;
  });

  it('should call toString on an unrecognized input and return a string render', () => {
    let render = createRender(1);
    expect(render).toBeInstanceOf(TextRender);
    expect(render.render).toEqual('1');
    render = createRender({ signature: 'div', props: 'not valid props' });
    expect(render).toBeInstanceOf(TextRender);
    expect(render.render).toEqual('[object Object]');
  });
});
