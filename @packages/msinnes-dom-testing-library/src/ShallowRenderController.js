import { BaseSsrRenderController } from '@internal/ssr/BaseSsrRenderController';

import {
  getByLabelText,
  getAllByLabelText,
  getByText,
  getAllByText,
  queryAllByLabelText,
  queryAllByText,
} from './queries';
import { traverse } from './traverse';

const handlers = [
  'onclick',
  'onblur',
  'onchangeonblur',
  'oncontextmenuonblur',
  'onfocusonblur',
  'onformchangeonblur',
  'onforminputonblur',
  'oninputonblur',
  'oninvalidonblur',
  'onresetonblur',
  'onselectonblur',
  'onsubmit',
  'onkeydown',
  'onkeypress',
  'onkeyup',
  'onclick',
  'ondblclick',
  'ondrag',
  'ondragend',
  'ondragenter',
  'ondragleave',
  'ondragover',
  'ondragstart',
  'ondrop',
  'onmousedown',
  'onmousemove',
  'onmouseout',
  'onmouseover',
  'onmouseup',
  'onmousewheel',
  'onscroll',
  'onabort',
  'oncanplay',
  'oncanplaythrough',
  'ondurationchange',
  'onemptied',
  'onended',
  'onerror',
  'onloadeddata',
  'onloadedmetadata',
  'onloadstart',
  'onpause',
  'onplay',
  'onplaying',
  'onprogress',
  'onratechange',
  'onreadystatechange',
  'onseeked',
  'onseeking',
  'onstalled',
  'onsuspend',
  'ontimeupdate',
  'onvolumechange',
  'onwaiting',
];


class ShallowRenderController extends BaseSsrRenderController {
  constructor(...args) {
    super(...args);

    this.wrapElement = this.wrapElement.bind(this);
  }

  render() {
    super.render();
    const container = this.ctx.dom.dom.window.document.body;
    traverse(this.domRenderer.root, component => {
      this.wrapElement(component);
    });
    return {
      container,
      getByLabelText: query => getByLabelText(container, query),
      getAllByLabelText: query => getAllByLabelText(container, query),
      queryAllByLabelText: query => queryAllByLabelText(container, query),
      getByText: query => getByText(container, query),
      getAllByText: query => getAllByText(container, query),
      queryAllByText: query => queryAllByText(container, query),
    };
  }

  wrapElement(component) {
    handlers.forEach(key => {
      const elem = component.elem.elem;
      if (elem[key] && elem[key] instanceof Function){
        const fn = elem[key];
        elem[key] = (...args) => {
          fn(...args);
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