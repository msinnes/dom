import { JSXRender } from '../JSXRender';

import { ElementRender } from '../ElementRender';

describe('ElementRender', () => {
  it('should be a class', () => {
    expect(ElementRender).toBeAClass();
  });

  it('should extend BaseRender', () => {
    expect(ElementRender).toExtend(JSXRender);
  });

  describe('instance', () => {
    let instance;
    beforeEach(() => {
      instance = new ElementRender([]);
    });

    it('should set isElementRender to true', () => {
      expect(instance.isElementRender).toBe(true);
    });

    it('should set isJSXRender to true', () => {
      expect(instance.isJSXRender).toBe(true);
    });
  });
});
