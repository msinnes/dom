import { BaseSsrRenderController } from '@internal/ssr/BaseSsrRenderController';

import {
  getByLabelText,
  getAllByLabelText,
  queryAllByLabelText,
  getByRole,
  getAllByRole,
  queryAllByRole,
  getByText,
  getAllByText,
  queryAllByText,
} from './queries';
import { traverse } from './traverse';
import {
  FORM_EVENTS,
  KEYBOARD_EVENTS,
  MOUSE_EVENTS,
  MEDIA_EVENTS,
} from './constants';

const ELEMENT_EVENTS = [
  ...FORM_EVENTS,
  ...KEYBOARD_EVENTS,
  ...MOUSE_EVENTS,
  ...MEDIA_EVENTS,
];

class ShallowRenderController extends BaseSsrRenderController {
  constructor(...args) {
    super(...args);

    this.wrapElement = this.wrapElement.bind(this);
  }

  processEffects() {
    this.ctx.enable();
    this.ctx.infra.services.digestEffects();
    this.ctx.disable();
    if (this.queue.length) {
      while(this.queue.length) {
        this.renderAppFrame();
      }
      super.render();
      this.processEffects();
    }
  }

  render() {
    super.render();
    this.processEffects();
    const container = this.ctx.dom.dom.window.document.body;
    traverse(this.domRenderer.root, component => {
      this.wrapElement(component);
    });
    return {
      container,
      getByLabelText: query => getByLabelText(container, query),
      getAllByLabelText: query => getAllByLabelText(container, query),
      queryAllByLabelText: query => queryAllByLabelText(container, query),
      getByRole: query => getByRole(container, query),
      getAllByRole: query => getAllByRole(container, query),
      queryAllByRole: query => queryAllByRole(container, query),
      getByText: query => getByText(container, query),
      getAllByText: query => getAllByText(container, query),
      queryAllByText: query => queryAllByText(container, query),
    };
  }

  wrapElement(component) {
    ELEMENT_EVENTS.forEach(key => {
      const elem = component.elem.elem;
      if (elem[key] && elem[key] instanceof Function){
        const fn = elem[key];
        elem[key] = (...args) => {
          this.ctx.enable();
          fn(...args);
          this.ctx.disable();
          while(this.queue.length) {
            this.renderAppFrame();
          }
          this.render();
        };
      }
    });
  }
}

export { ShallowRenderController };