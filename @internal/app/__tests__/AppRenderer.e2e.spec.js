import { extendz } from '@internal/oop/extendz';

import { BaseAppRenderer, AppRenderer, RenderableComponent } from '../AppRenderer';
import { AppRender } from '../AppRender';
import { ClassComponent } from '../components/ClassComponent';

class CreateableAppRenderer extends BaseAppRenderer {
  create(render) {
    const appRender = render instanceof AppRender ? render : new AppRender(render);
    const { isArrayRender, isStringRender, isEmptyRender, render: _render } = appRender;
    const { signature, props } = _render || {};
    if (extendz(signature, RenderableComponent)) return new ClassComponent(signature, props, { renderFrame: this.renderFrame });
    return super.create(appRender);
  }
}

describe('e2e', () => {
  let instance;
  let clearContextValueMock;
  let mockServices;
  beforeEach(() => {
    clearContextValueMock = jest.fn();
    mockServices = {
      clearContextValue: clearContextValueMock,
    };
    instance = new CreateableAppRenderer({ signature: 'div', props: {} }, mockServices);
  });

  describe('render component', () => {
    class RenderComponentComponent extends RenderableComponent {
      render() {
        return { signature: 'span', props: { innerText: this.props.content } };
      }
    }

    it('should render a component', () => {
      instance.render({ signature: RenderComponentComponent, props: { content: 'text' } }, instance.root);
      expect(instance.resolve()).toMatchObject({
        signature: 'div',
        props: {},
        children: [
          {
            signature: 'span',
            props: { innerText: 'text' },
            children: [],
          }
        ]
      });
    });

    it('should update a component', () => {
      instance.render({
        signature: RenderComponentComponent,
        props: { content: 'text' }
      }, instance.root);
      expect(instance.resolve()).toMatchObject({
        signature: 'div',
        props: {},
        children: [
          {
            signature: 'span',
            props: { innerText: 'text' },
            children: [],
          }
        ]
      });

      instance.render({
        signature: RenderComponentComponent,
        props: { content: 'text 1' },
      }, instance.root, instance.root.firstChild);
      expect(instance.resolve()).toMatchObject({
        signature: 'div',
        props: {},
        children: [
          {
            signature: 'span',
            props: { innerText: 'text 1' },
            children: [],
          }
        ]
      });
    });
  });

  describe('component with rendered children', () => {
    class ChildComponent extends RenderableComponent {
      render() {
        return { signature: 'p', props: { innerText: this.props.text } };
      }
    }

    class ParentComponent extends RenderableComponent {
      render() {
        return {
          signature: 'div',
          props: {},
          children: [
            { signature: ChildComponent, props: { text: 'text 1' } },
            { signature: ChildComponent, props: { text: 'text 2' } },
          ],
        };
      }
    }

    it('should render a component with render children', () => {
      instance.render({ signature: ParentComponent, props: {} }, instance.root);
      expect(instance.resolve()).toMatchObject({
        signature: 'div',
        props: {},
        children: [{
          signature: 'div',
          props: {},
          children: [
            { signature: 'p', props: { innerText: 'text 1' }, children: [] },
            { signature: 'p', props: { innerText: 'text 2' }, children: [] },
          ],
        }],
      });
    });

    it('should update a component with render children', () => {
      instance.render({ signature: ParentComponent, props: {} }, instance.root);
      expect(instance.resolve()).toMatchObject({
        signature: 'div',
        props: {},
        children: [{
          signature: 'div',
          props: {},
          children: [
            {
              signature: 'p',
              props: { innerText: 'text 1' },
              children: [],
            },
            {
              signature: 'p',
              props: { innerText: 'text 2' },
              children: [] },
          ],
        }]
      });

      instance.render({ signature: 'div', props: { innerText: 'text 1'} }, instance.root, instance.root.firstChild);
      expect(instance.resolve()).toMatchObject({
        signature: 'div',
        props: {},
        children: [{
          signature: 'div',
          props: { innerText: 'text 1' },
          children: [] }]
      });
      // it should have unmounted all of the div's children
      expect(instance.root.firstChild.children.length).toBe(0);
    });

    it('should render an array', () => {
      instance.render([{ signature: 'div' }, { signature: 'div' }], instance.root);
      expect(instance.resolve()).toMatchObject({
        signature: 'div',
        props: {},
        children: [
          [{
            signature: 'div',
            props: {},
            children: []
          }, {
            signature: 'div',
            props: {},
            children: []
          }],
        ],
      });
    });

    it('should render an empty component', () => {
      instance.render(null, instance.root);
      expect(instance.resolve()).toEqual({
        signature: 'div',
        props: {},
        children: [
          null,
        ],
      });
      instance.root.firstChild.unmount();
      instance.render(undefined, instance.root);
      expect(instance.resolve()).toEqual({
        signature: 'div',
        props: {},
        children: [
          null,
        ],
      });
    });
  });
});