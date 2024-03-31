/**
 * @jest-environment jsdom
 */
import { SvgComponent } from '../SvgComponent';

import { ForeignObjectComponent } from '../ForeignObjectComponent';

describe('ForeignObjectComponent', () => {
  it('should be a class', () => {
    expect(ForeignObjectComponent).toBeAClass();
  });

  it('should extend SvgComponent', () => {
    expect(ForeignObjectComponent).toExtend(SvgComponent);
  });

  describe('instance', () => {
    let instance;

    beforeEach(() => {
      instance = new ForeignObjectComponent('foreignObject');
    });

    it('should set the correct component flags', () => {
      expect(instance.isJSXComponent).toBe(true);
      expect(instance.isDomComponent).toBe(true);
      expect(instance.isElementComponent).toBe(true);
      expect(instance.isSvgComponent).toBe(true);
      expect(instance.isForeignObjectComponent).toBe(true);
    });

    it('should set the xmlns prop if the tag is not foreignObject', () => {
      expect(instance.elem.elem.getAttribute('xmlns')).toBe(null);
      instance = new ForeignObjectComponent('div');
      expect(instance.elem.elem.getAttribute('xmlns')).toBe('http://www.w3.org/1999/xhtml');
    });
  });
});
