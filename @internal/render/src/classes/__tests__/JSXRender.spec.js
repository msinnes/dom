import { BaseRender } from '../BaseRender';

import { JSXRender } from '../JSXRender';

describe('JSXRender', () => {
  it('should be a class', () => {
    expect(JSXRender).toBeAClass();
  });

  it('should extend BaseRender', () => {
    expect(JSXRender).toExtend(BaseRender);
  });

  describe('instance', () => {
    let instance;
    beforeEach(() => {
      instance = new JSXRender({});
    });

    it('should set isJSXRender to true', () => {
      expect(instance.isJSXRender).toBe(true);
    });
  });
});
