import { DomRef } from '@internal/dom/DomRef';
import { DomRenderer } from '@internal/dom/DomRenderer';
import { SsrContext } from '@internal/ssr/SsrContext';

import { renderDomString } from '../renderDomString';

describe('renderDomString', () => {
  let ssrContext;
  let root;
  let domRenderer;
  beforeEach(() => {
    ssrContext = new SsrContext();
    ssrContext.enable();
    root = new DomRef(document.body);
    domRenderer = new DomRenderer({ signature: root, props: {} })
  });

  afterEach(() => {
    ssrContext.disable();
  });

  it('should be a function', () => {
    expect(renderDomString).toBeInstanceOf(Function);
  });

  describe('string renders', () => {
    it('should return the string', () => {
      domRenderer.render('text', domRenderer.root);
      const str = renderDomString(domRenderer.root);
      expect(str).toEqual('text');
    });
  });

  describe('array renders', () => {
    it('should return an empty string for an empty array', () => {
      domRenderer.render([], domRenderer.root);
      const str = renderDomString(domRenderer.root);
      expect(str).toEqual('');
    });

    it('should concatenate renders recursively', () => {
      domRenderer.render(['text', 'text'], domRenderer.root);
      const str = renderDomString(domRenderer.root);
      expect(str).toEqual('texttext');
    });

    it('should concatenate nested array renders', () => {
      domRenderer.render([['text', 'text'], 'text'], domRenderer.root);
      const str = renderDomString(domRenderer.root);
      expect(str).toEqual('texttexttext');
    });

    it('should concatenate jsx renders', () => {
      domRenderer.render([{ signature: 'div' }, { signature: new DomRef('div') }], domRenderer.root);
      const str = renderDomString(domRenderer.root);
      expect(str).toEqual('<div></div><div></div>')
    });

    it('should concatenate jsx renders with props', () => {
      domRenderer.render([
        { signature: 'div', props: { height: '100px', width: '100px', prop: 'prop', prop2: 'prop2' } },
        { signature: new DomRef('div'), props: { height: '100px', width: '100px', prop: 'prop', prop2: 'prop2' } },
      ], domRenderer.root);
      const str = renderDomString(domRenderer.root);
      expect(str).toEqual('<div height="100px" width="100px"></div><div height="100px" width="100px"></div>');
    });
  });

  describe('jsx renders', () => {
    it('should render string signatures with no props or children', () => {
      domRenderer.render({ signature: 'div' }, domRenderer.root);
      const str = renderDomString(domRenderer.root);
      expect(str).toEqual('<div></div>');
    });

    it('should render ref signatures with no props or children', () => {
      domRenderer.render({ signature: new DomRef('div') }, domRenderer.root);
      const str = renderDomString(domRenderer.root);
      expect(str).toEqual('<div></div>');
    });

    it('should render string signatures with props', () => {
      domRenderer.render({ signature: 'div', props: { height: '100px', width: '100px', prop: 'prop', prop2: 'prop2' } }, domRenderer.root);
      const str = renderDomString(domRenderer.root);
      expect(str).toEqual('<div height="100px" width="100px"></div>');
    });

    it('should render ref signatures with props', () => {
      domRenderer.render({ signature: new DomRef('div'), props: { height: '100px', width: '100px', prop: 'prop', prop2: 'prop2' } }, domRenderer.root);
      const str = renderDomString(domRenderer.root);
      expect(str).toEqual('<div height="100px" width="100px"></div>');
    });

    it('should render string signatures with children', () => {
      domRenderer.render({ signature: 'div', children: [
        'some text'
      ]}, domRenderer.root);
      const str = renderDomString(domRenderer.root);
      expect(str).toEqual('<div>some text</div>');
    });

    it('should render ref signatures with children', () => {
      domRenderer.render({ signature: new DomRef('div'), children: [
        'some text'
      ]}, domRenderer.root);
      const str = renderDomString(domRenderer.root);
      expect(str).toEqual('<div>some text</div>');
    });

    it('should render with innerHTML', () => {
      domRenderer.render({signature: new DomRef('div'), props: { innerHTML: '<p>text</p>'} }, domRenderer.root);
      const str = renderDomString(domRenderer.root);
      expect(str).toEqual('<div><p>text</p></div>');
    });

    it('should render with innerText', () => {
      domRenderer.render({signature: new DomRef('div'), props: { innerText: 'text'} }, domRenderer.root);
      const str = renderDomString(domRenderer.root);
      expect(str).toEqual('<div>text</div>');
    });

    it('should render with textContent', () => {
      domRenderer.render({signature: new DomRef('div'), props: { textContent: 'text'} }, domRenderer.root);
      const str = renderDomString(domRenderer.root);
      expect(str).toEqual('<div>text</div>');
    });

    it('should render with className', () => {
      domRenderer.render({ signature: new DomRef('div'), props: { className: 'className' } }, domRenderer.root);
      const str = renderDomString(domRenderer.root);
      expect(str).toEqual('<div class="className"></div>');
    });
  });
});