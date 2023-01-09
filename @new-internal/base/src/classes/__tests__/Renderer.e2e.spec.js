/**
 * @jest-environment jsdom
 */
import { createElement } from '@new-internal/utils';

import { Renderer } from '../Renderer';

class Component {}

describe('Renderer.e2e', () => {
  afterEach(() => {
    while(document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  describe('basic renders', () => {
    describe('empty render', () => {
      it('should render null', () => {
        const renderer = new Renderer(Component, null, document.body);
        renderer.render(renderer.root.render(), renderer.root);
        expect(renderer.root.firstChild).toBeDefined();
        expect(document.body.innerHTML).toEqual('');
      });

      it('should render undefined', () => {
        const renderer = new Renderer(Component, undefined, document.body);
        renderer.render(renderer.root.render(), renderer.root);
        expect(renderer.root.firstChild).toBeDefined();
        expect(document.body.innerHTML).toEqual('');
      });
    });

    describe('string render', () => {
      it('should render a string', () => {
        const text = 'text';
        const renderer = new Renderer(Component, text, document.body);
        renderer.render(renderer.root.render(), renderer.root);
        const textComponent = renderer.root.firstChild;
        expect(textComponent.text).toEqual(text);
        expect(document.body.innerHTML).toEqual('text');
      });
    });

    describe('array render', () => {
      it('should render an empty array', () => {
        const renderer = new Renderer(Component, [], document.body);
        renderer.render(renderer.root.render(), renderer.root);
        const arrayComponent = renderer.root.firstChild;
        expect(arrayComponent.components.length).toEqual(0);
        expect(document.body.innerHTML).toEqual('');
      });

      it('should render an array of strings', () => {
        const renderer = new Renderer(Component, ['text 1', 'text 2'], document.body);
        renderer.render(renderer.root.render(), renderer.root);
        const arrayComponent = renderer.root.firstChild;
        expect(arrayComponent.components.length).toEqual(2);
        expect(arrayComponent.children[0].text).toEqual('text 1');
        expect(arrayComponent.children[1].text).toEqual('text 2');
        expect(document.body.innerHTML).toEqual('text 1text 2');
      });

      it('should render an array of elements', () => {
        const render = [createElement('div'), createElement('div')];
        const renderer = new Renderer(Component, render, document.body);
        renderer.render(renderer.root.render(), renderer.root);
        const arrayComponent = renderer.root.firstChild;
        expect(arrayComponent.components.length).toEqual(2);
        expect(arrayComponent.children[0].elem.tag).toEqual('div');
        expect(arrayComponent.children[1].elem.tag).toEqual('div');
        expect(document.body.innerHTML).toEqual('<div></div><div></div>');
      });
    });

    describe('element component', () => {
      it('should render an empty div', () => {
        const render = createElement('div');
        const renderer = new Renderer(Component, render, document.body);
        renderer.render(renderer.root.render(), renderer.root);
        const elementComponent = renderer.root.firstChild;
        expect(elementComponent.elem.tag).toEqual('div');
        expect(document.body.innerHTML).toEqual('<div></div>');
      });


      it('should render a div with text children', () => {
        const render = createElement('div', {}, ['text']);
        const renderer = new Renderer(Component, render, document.body);
        renderer.render(renderer.root.render(), renderer.root);
        const elementComponent = renderer.root.firstChild;
        expect(elementComponent.elem.tag).toEqual('div');
        expect(elementComponent.firstChild.text).toEqual('text');
        expect(document.body.innerHTML).toEqual('<div>text</div>');
      });

      it('should render nested elements in a list', () => {
        const render = createElement('ul', {}, [
          createElement('li', {}, ['text 1']),
          createElement('li', {}, ['text 2']),
        ]);
        const renderer = new Renderer(Component, render, document.body);
        renderer.render(renderer.root.render(), renderer.root);
        const elementComponent = renderer.root.firstChild;
        expect(elementComponent.elem.tag).toEqual('ul');
        const firstChild = elementComponent.children[0];
        expect(firstChild.elem.tag).toEqual('li');
        expect(firstChild.firstChild.text).toEqual('text 1');
        const secondChild = elementComponent.children[1];
        expect(secondChild.elem.tag).toEqual('li');
        expect(secondChild.firstChild.text).toEqual('text 2');
        expect(document.body.innerHTML).toEqual('<ul><li>text 1</li><li>text 2</li></ul>');
      });
    });

    describe('function component', () => {
      it('should render a function component that returns text', () => {
        const render = createElement(() => 'text');
        const renderer = new Renderer(Component, render, document.body);
        renderer.render(renderer.root.render(), renderer.root);
        const functionComponent = renderer.root.firstChild;
        expect(functionComponent.firstChild.text).toEqual('text');
        expect(document.body.innerHTML).toEqual('text');
      });

      it('should render a function component that returns null', () => {
        const render = createElement(() => null);
        const renderer = new Renderer(Component, render, document.body);
        renderer.render(renderer.root.render(), renderer.root);
        const functionComponent = renderer.root.firstChild;
        expect(functionComponent.firstChild).toBeDefined();
        expect(document.body.innerHTML).toEqual('');
      });

      it('should render a function component that return an element component', () => {
        const render = createElement(() => createElement('div'));
        const renderer = new Renderer(Component, render, document.body);
        renderer.render(renderer.root.render(), renderer.root);
        const functionComponent = renderer.root.firstChild;
        expect(functionComponent.firstChild.elem.tag).toEqual('div');
        expect(document.body.innerHTML).toEqual('<div></div>');
      });

      it('should render a function component that return an element component with text', () => {
        const render = createElement(() => createElement('div', {}, ['text']));
        const renderer = new Renderer(Component, render, document.body);
        renderer.render(renderer.root.render(), renderer.root);
        const functionComponent = renderer.root.firstChild;
        expect(functionComponent.firstChild.elem.tag).toEqual('div');
        expect(functionComponent.firstChild.firstChild.text).toEqual('text');
        expect(document.body.innerHTML).toEqual('<div>text</div>');
      });

      it('should render a function component that returns an array', () => {
        const render = createElement(() => ['text']);
        const renderer = new Renderer(Component, render, document.body);
        renderer.render(renderer.root.render(), renderer.root);
        const functionComponent = renderer.root.firstChild;
        expect(functionComponent.firstChild.components).toBeInstanceOf(Array);
        expect(functionComponent.firstChild.components.length).toEqual(1);
        expect(functionComponent.firstChild.firstChild.text).toEqual('text');
      });
    });

    describe('class component', () => {
      it('should render a class component that returns text', () => {
        const render = createElement(class TextComponent extends Component {
          render() {
            return 'text';
          }
        });
        const renderer = new Renderer(Component, render, document.body);
        renderer.render(renderer.root.render(), renderer.root);
        const classComponent = renderer.root.firstChild;
        expect(classComponent.firstChild.text).toEqual('text');
        expect(document.body.innerHTML).toEqual('text');
      });

      it('should render a class component that returns null', () => {
        const render = createElement(class TextComponent extends Component {
          render() {
            return null;
          }
        });
        const renderer = new Renderer(Component, render, document.body);
        renderer.render(renderer.root.render(), renderer.root);
        const classComponent = renderer.root.firstChild;
        expect(classComponent.firstChild).toBeDefined();
        expect(document.body.innerHTML).toEqual('');
      });

      it('should render a class component that return an element component', () => {
        const render = createElement(class TextComponent extends Component {
          render() {
            return createElement('div');
          }
        });
        const renderer = new Renderer(Component, render, document.body);
        renderer.render(renderer.root.render(), renderer.root);
        const classComponent = renderer.root.firstChild;
        expect(classComponent.firstChild.elem.tag).toEqual('div');
        expect(document.body.innerHTML).toEqual('<div></div>');
      });

      it('should render a class component that return an element component with text', () => {
        const render = createElement(class TextComponent extends Component {
          render() {
            return createElement('div', {}, ['text']);
          }
        });
        const renderer = new Renderer(Component, render, document.body);
        renderer.render(renderer.root.render(), renderer.root);
        const classComponent = renderer.root.firstChild;
        expect(classComponent.firstChild.elem.tag).toEqual('div');
        expect(classComponent.firstChild.firstChild.text).toEqual('text');
        expect(document.body.innerHTML).toEqual('<div>text</div>');
      });

      it('should render a class component that returns an array', () => {
        const render = createElement(class TextComponent extends Component {
          render() {
            return ['text'];
          }
        });
        const renderer = new Renderer(Component, render, document.body);
        renderer.render(renderer.root.render(), renderer.root);
        const classComponent = renderer.root.firstChild;
        expect(classComponent.firstChild.components).toBeInstanceOf(Array);
        expect(classComponent.firstChild.components.length).toEqual(1);
        expect(classComponent.firstChild.firstChild.text).toEqual('text');
      });
    });
  });
});