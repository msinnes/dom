import * as jsdom from 'jsdom';
const { JSDOM } = jsdom;

// TODO: this should take an optional route from the in put request config
// necessary for routing to run server side
class DomContext {
  constructor() {
    this.dom = new JSDOM('');
  }

  enable() {
    const { window } = this.dom;
    global.window = window;
    global.document = window.document;
    global.location = window.location;
    global.Text = window.Text;
  }

  disable() {
    delete global.window;
    delete global.document;
    delete global.location;
    delete global.Text;
  }
}

export { DomContext };