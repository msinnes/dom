import { BaseRender } from '../BaseRender';

class TestableBaseRender extends BaseRender {}

describe('BaseRender', () => {
  it('should be a class', () => {
    expect(BaseRender).toBeAClass();
  });

  it('should be an abstract class', () => {
    expect(BaseRender).toBeAbstract();
  });

  describe('instance', () => {
    let instance;
    let ref;
    beforeEach(() => {
      ref = {};
      instance = new TestableBaseRender(ref);
    });

    it('should set the default is value', () => {
      expect(instance.isTextRender).toBe(false);
      expect(instance.isArrayRender).toBe(false);
      expect(instance.isElementRender).toBe(false);
      expect(instance.isEmptyRender).toBe(false);
      expect(instance.isJSXRender).toBe(false);
      expect(instance.isElementRender).toBe(false);
    });

    it('should set the render prop to the input', () => {
      expect(instance.render).toBe(ref);
    });

    it('should have a signature getter', () => {
      expect(instance.signature).toBeUndefined();
      instance = new TestableBaseRender({ signature: 'signature' });
      instance.isJSXRender = true;
      expect(instance.signature).toEqual('signature');
    });

    it('should have a props getter', () => {
      expect(instance.props).toMatchObject({});
      let input = { props: { prop1: 'prop1' }, children: [] };
      instance = new TestableBaseRender(input);
      instance.isJSXRender = true;
      expect(instance.props).toMatchObject({
        prop1: 'prop1',
        children: input.children,
      });
    });

    it('should have a children getter', () => {
      const renderRef = {};
      instance = new TestableBaseRender(renderRef);
      instance.isJSXRender = true;
      expect(instance.children).toMatchObject([renderRef]);
      const childrenRef = [];
      instance = new TestableBaseRender({ children: childrenRef });
      instance.isElementRender = true;
      expect(instance.children).toBe(childrenRef);
      instance = new TestableBaseRender(childrenRef);
      instance.isArrayRender = true;
      expect(instance.children).toBe(childrenRef);
      instance = new TestableBaseRender();
      instance.isTextRender = true;
      expect(instance.children).toMatchObject([]);
      instance = new TestableBaseRender();
      instance.isEmptyRender = true;
      expect(instance.children).toMatchObject([]);
    });

    it('should have a propsObj getter', () => {
      const propsRef = {};
      const renderRef = { props: propsRef, children: [] };
      instance = new TestableBaseRender(renderRef);
      instance.isJSXRender = true;
      expect(instance.propsObj).toMatchObject({ ...propsRef, children: [] });
      const childrenRef = [];
      instance = new TestableBaseRender(childrenRef);
      instance.isArrayRender = true;
      expect(instance.propsObj).toBe(childrenRef);
      instance = new TestableBaseRender('string');
      instance.isTextRender = true;
      expect(instance.propsObj).toEqual('string');
      instance = new TestableBaseRender();
      instance.isEmptyRender = true;
      expect(instance.propsObj).toBeUndefined();
    });
  });
});