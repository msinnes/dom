import { DomRender } from '@internal/dom/DomRender';
import { DomComponent, ArrayComponent, StringComponent } from '@internal/dom/DomComponent';

import { isString } from '@internal/is/string';

import { createElement } from './HTMLElements';

const validAttributes = [
  'accept',
  'accept',
  'accesskey',
  'action',
  'align',
  'allow',
  'alt',
  'async',
  'autocapitalize',
  'autocomplete',
  'autofocus',
  'autoplay',
  'background',
  'bgcolor',
  'border',
  'buffered',
  'capture',
  'challenge',
  'charset',
  'checked',
  'cite',
  'class',
  'code',
  'codebase',
  'color',
  'cols',
  'colspan',
  'content',
  'contenteditable',
  'contextmenu',
  'controls',
  'coords',
  'crossorigin',
  'csp',
  'data',
  'data',
  'datetime',
  'decoding',
  'default',
  'defer',
  'dir',
  'dirname',
  'disabled',
  'download',
  'draggable',
  'enctype',
  'enterkeyhint',
  'for',
  'form',
  'formaction',
  'formenctype',
  'formmethod',
  'formnovalidate',
  'formtarget',
  'headers',
  'height',
  'hidden',
  'high',
  'href',
  'hreflang',
  'http',
  'icon',
  'id',
  'importance',
  'integrity',
  'intrinsicsize',
  'inputmode',
  'ismap',
  'itemprop',
  'keytype',
  'kind',
  'label',
  'lang',
  'language',
  'loading',
  'list',
  'loop',
  'low',
  'manifest',
  'max',
  'maxlength',
  'minlength',
  'media',
  'method',
  'min',
  'multiple',
  'muted',
  'name',
  'novalidate',
  'open',
  'optimum',
  'pattern',
  'ping',
  'placeholder',
  'poster',
  'preload',
  'radiogroup',
  'readonly',
  'referrerpolicy',
  'rel',
  'required',
  'reversed',
  'role',
  'rows',
  'rowspan',
  'sandbox',
  'scope',
  'scoped',
  'selected',
  'shape',
  'size',
  'sizes',
  'slot',
  'span',
  'spellcheck',
  'src',
  'srcdoc',
  'srclang',
  'srcset',
  'start',
  'step',
  'style',
  'summary',
  'tabindex',
  'target',
  'title',
  'translate',
  'type',
  'usemap',
  'value',
  'width',
  'wrap',
];

function attrString(elem) {
  const attrs = Object.keys(elem).filter(key => validAttributes.indexOf(key) >= 0);
  const accumulator = elem.className ? ` class="${elem.className}"` : ' ';
  if (attrs.length === 0 && accumulator.trim().length === 0) return '';

  return attrs.reduce((acc, attr, index) => {
    const data = elem[attr];
    acc += `${attr}="${data}"`;
    acc += index === (attrs.length - 1) ? '' : ' ';
    return acc;
  }, accumulator);
}

function childrenString(children, props) {
  if (children && children.length) return renderArrayDomString(children);
  const { innerHTML, innerText, textContent } = props;
  return innerHTML || innerText || textContent || '';
}

function renderElementDomString(component) {
  const tag = component.tag;
  const attrs = attrString(component.elem.elem);
  const children = childrenString(component.children, component.elem.elem);

  const elem = createElement(tag, attrs, children);
  return elem.stringify();
}

function renderArrayDomString(domRenderArray) {
  return domRenderArray.reduce((acc, item) => acc += renderDomElement(item), '');
}

function renderDomElement(component) {
  if (component instanceof StringComponent) return component.elem.elem.textContent;
  if (component instanceof ArrayComponent) return renderArrayDomString(component.children);
  return renderElementDomString(component);
}

function renderDomString(root) {
  return renderArrayDomString(root.children);
}

export { renderDomString };