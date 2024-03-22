import { validHtmlAttributes } from '@shared/json/htmlAttributes';
import { voidHtmlTags } from '@shared/json/htmlTags';

const renderArray = components => components.map(comp => renderComponent(comp)).join('');

const renderElement = component => {
  const { tag, elem } = component.elem;
  const attrs = renderAttrs(elem);
  if (voidHtmlTags.indexOf(tag) >= 0) return renderVoidElement(tag, attrs);
  const children = renderElementChildren(component);
  return renderNormalElement(tag, attrs, children);
};

const renderAttrs = elem => {
  const attrs = Object.keys(elem).filter(key => validHtmlAttributes.indexOf(key) >= 0);
  const accumulator = elem.className ? ` class="${elem.className}" ` : ' ';
  if (attrs.length === 0 && accumulator.trim().length === 0) return '';

  const lastIndex = attrs.length - 1;
  return attrs.reduce((acc, attr, index) => {
    const data = elem[attr];
    acc += `${attr}="${data}"`;
    acc += index === lastIndex ? '' : ' ';
    return acc;
  }, accumulator);
};

const renderElementChildren = component => {
  if (component.children) return renderArray(component.children);
  return component.textContent || component.innerText || component.innerHTML || '';
};

const renderBaseElement = (tag, attrs) => `<${tag}${attrs}`;
const renderNormalElement = (tag, attrs, children) => `${renderBaseElement(tag, attrs)}>${children}</${tag}>`;
const renderVoidElement = (tag, attrs) => `${renderBaseElement(tag, attrs)} />`;


const renderComponent = component => {
  if (component.isEmptyComponent) return '';
  if (component.isTextComponent) return component.text;
  if (component.isElementComponent) return renderElement(component);
  return renderArray(component.children);
};

export {
  renderArray,
  renderAttrs,
  renderComponent,
  renderElement,
  renderElementChildren,
  renderBaseElement,
  renderNormalElement,
  renderVoidElement,
};
