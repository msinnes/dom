/**
 * @jest-environment jsdom
 */
import { createRender } from '@internal/render';

import { ArrayComponent } from '../../classes/ArrayComponent';
import { ClassComponent } from '../../classes/ClassComponent';
import { HtmlComponent } from '../../classes/HtmlComponent';
import { EmptyComponent } from '../../classes/EmptyComponent';
import { FunctionComponent } from '../../classes/FunctionComponent';
import { SvgComponent } from '../../classes/SvgComponent';
import { TextComponent } from '../../classes/TextComponent';

import { createComponentFactory } from '../createComponentFactory';

describe('createComponentFactory', () => {
  it('should be a function', () => {
    expect(createComponentFactory).toBeInstanceOf(Function);
  });

  describe('createComponent', () => {
    let createComponent;
    class Component {}
    let domContextRef;
    let servicesRef;
    beforeEach(() => {
    domContextRef = { value: { isSvgParent: false, isForeignObjectParent: false }};
    servicesRef = {};
    createComponent = createComponentFactory(Component, domContextRef, servicesRef);
  });

  it('should return a createComponent function and inject the dom context', () => {
    expect(createComponent).toBeInstanceOf(Function);
  });

  it('should create an ArrayComponent from an ArrayRender and inject the dom context', () => {
    const arrayRender = createRender([]);
    const component = createComponent(arrayRender);
    expect(component).toBeInstanceOf(ArrayComponent);
    expect(component.domContext).toBe(domContextRef);
    expect(component.services).toBe(servicesRef);
  });

  it('should create an ClassComponent from an JSXRender and inject the dom context', () => {
    class MyClassComponent extends Component {}
    const classRender = createRender({ signature: MyClassComponent });
    const component = createComponent(classRender);
    expect(component).toBeInstanceOf(ClassComponent);
    expect(component.domContext).toBe(domContextRef);
    expect(component.services).toBe(servicesRef);
  });

  it('should create an HtmlComponent from an ElementRender and inject the dom context', () => {
    const elementRender = createRender({ signature: 'div' });
    const component = createComponent(elementRender);
    expect(component).toBeInstanceOf(HtmlComponent);
    expect(component.domContext).toBe(domContextRef);
    expect(component.services).toBe(servicesRef);
  });

  it('should create an SvgComponent if the input signature is svg', () => {
    const elementRender = createRender({ signature: 'svg' });
    const component = createComponent(elementRender);
    expect(component).toBeInstanceOf(SvgComponent);
    expect(component.domContext).toBe(domContextRef);
    expect(component.services).toBe(servicesRef);
  });

  it('should create an SvgComponent if the context parent is an svg parent', () => {
    domContextRef.value.isSvgParent = true;
    const elementRender = createRender({ signature: 'circle' });
    const component = createComponent(elementRender);
    expect(component).toBeInstanceOf(SvgComponent);
    expect(component.domContext).toBe(domContextRef);
    expect(component.services).toBe(servicesRef);
  });

  it('should create an EmptyComponent from an EmptyRender and inject the dom context', () => {
    const emptyRender = createRender(null);
    const component = createComponent(emptyRender);
    expect(component).toBeInstanceOf(EmptyComponent);
    expect(component.domContext).toBe(domContextRef);
    expect(component.services).toBe(servicesRef);
  });

  it('should create a FunctionComponent from a JSXRender and inject the dom context', () => {
    const functionRender = createRender({ signature: () => {} });
    const component = createComponent(functionRender);
    expect(component).toBeInstanceOf(FunctionComponent);
    expect(component.domContext).toBe(domContextRef);
    expect(component.services).toBe(servicesRef);
  });

  it('should create a TextComponent from a TextRender and inject the dom context', () => {
    const textRender = createRender('text');
    const component = createComponent(textRender);
    expect(component).toBeInstanceOf(TextComponent);
    expect(component.domContext).toBe(domContextRef);
    expect(component.services).toBe(servicesRef);
  });
  });
});
