import { JSDOM } from 'jsdom';

import { Scope } from '../base/Scope';

class DomScope extends Scope {
  constructor(config, timeScope) {
    super();
    this.dom = new JSDOM('', config);
    // Override timers on the window instance.
    this.dom.window.setTimeout = timeScope.timeouts.set.bind(timeScope.timeouts);
    this.dom.window.clearTimeout = timeScope.timeouts.clear.bind(timeScope.timeouts);
    this.dom.window.setInterval = timeScope.intervals.set.bind(timeScope.intervals);
    this.dom.window.clearInterval = timeScope.intervals.clear.bind(timeScope.intervals);
    this.dom.window.requestAnimationFrame = timeScope.animationFrames.set.bind(timeScope.animationFrames);
    this.dom.window.cancelAnimationFrame = timeScope.animationFrames.clear.bind(timeScope.animationFrames);
  }

  enable() {
    const { window } = this.dom;
    global.window = window;
    global.document = window.document;
    global.location = window.location;
    global.Text = window.Text;
    global.PopStateEvent = window.PopStateEvent;
  }

  disable() {
    delete global.window;
    delete global.document;
    delete global.location;
    delete global.Text;
    delete global.PopStateEvent;
  }
}

export { DomScope };
