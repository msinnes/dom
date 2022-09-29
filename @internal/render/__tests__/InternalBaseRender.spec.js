import { InternalBaseRender } from '../InternalBaseRender';

describe('InternalBaseRender', () => {
  it('should be a function', () => {
    expect(InternalBaseRender).toBeInstanceOf(Function);
  });

  it('should be abstract', () => {
    let error;
    try {
      new InternalBaseRender();
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
    expect(error.message.startsWith('TypeError')).toBe(true);
  });

  describe('instance', () => {
    let instance;
    class TestableBaseRender extends InternalBaseRender {}
    beforeEach(() => {
      instance = new TestableBaseRender();
    });

    it('should set the default is value', () => {
      expect(instance.isStringRender).toBe(false);
      expect(instance.isArrayRender).toBe(false);
      expect(instance.isEmptyRender).toBe(false);
      expect(instance.isJSXRender).toBe(false);
    });
  });
});