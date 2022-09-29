import { JSXRender } from '../JSXRender';
import { InternalBaseRender } from '../InternalBaseRender';

describe('JSXRender', () => {
  it('should be a class', () => {
    expect(JSXRender).toBeAClass();
  });

  it('should extend InternalBaseRender', () => {
    expect(JSXRender).toExtend(InternalBaseRender);
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