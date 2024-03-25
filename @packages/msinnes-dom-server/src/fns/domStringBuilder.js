import { validHtmlAttributes } from '@shared/json/htmlAttributes';
import { validSvgAttributes } from '@shared/json/svgAttributes';
import { voidHtmlTags } from '@shared/json/htmlTags';

const renderArray = components => components.map(comp => renderComponent(comp)).join('');

const tagFilters = {
  animatemotion: 'animateMotion',
  animatetransform: 'animateTransform',
};

const filterTag = tag => tagFilters[tag] ? tagFilters[tag] : tag;

// TODO: (svg-update) check this for valid and deprecated tags
const renderElement = component => {
  const { tag, elem } = component.elem;
  const { isSvgComponent, props } = component;

  const attrs = isSvgComponent ? renderSvgAttrs(props, tag) : renderHtmlAttrs(elem);
  if (voidHtmlTags.indexOf(tag) >= 0) return renderVoidElement(tag, attrs);
  const children = renderElementChildren(component);
  return renderNormalElement(filterTag(tag), attrs, children);
};

const getAttributeString = (attrs, data, accumulator) => {
  const lastIndex = attrs.length - 1;
  return attrs.reduce((acc, attr, index) => {
    const datum = data[attr];
    acc += `${attr}="${datum}"`;
    acc += index === lastIndex ? '' : ' ';
    return acc;
  }, accumulator);
};

const renderSvgAttrs = (props, tag) => {
  let updateProps;
  if (tag === 'svg') updateProps = { ...props, xmlns: 'http://www.w3.org/2000/svg' };
  else updateProps = props;
  const attrs = Object.keys(updateProps).filter(key => validSvgAttributes.indexOf(key) >= 0);
  if (attrs.length === 0) return '';

  return getAttributeString(attrs, updateProps, ' ');
};

// TODO: (svg-update) check this for svg and deprecated
const renderHtmlAttrs = elem => {
  const attrs = Object.keys(elem).filter(key => validHtmlAttributes.indexOf(key) >= 0);
  const accumulator = elem.className ? ` class="${elem.className}" ` : ' ';
  if (attrs.length === 0 && accumulator.trim().length === 0) return '';

  return getAttributeString(attrs, elem, accumulator);
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
  renderHtmlAttrs,
  renderSvgAttrs,
  renderComponent,
  renderElement,
  renderElementChildren,
  renderBaseElement,
  renderNormalElement,
  renderVoidElement,
};
