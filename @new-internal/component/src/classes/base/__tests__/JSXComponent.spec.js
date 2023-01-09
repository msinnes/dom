import { createRender } from '@new-internal/render';

import { BaseComponent } from '../BaseComponent';

import { JSXComponent } from '../JSXComponent';

class TestableJSXComponent extends JSXComponent {
  render() {}
}

describe('JSXComponent', () => {
  it('should be a class', () => {
    expect(JSXComponent).toBeAClass();
  });

  it('should be abstract', () => {
    expect(JSXComponent).toBeAbstract();
  });

  it('should extend BaseComponent', () => {
    expect(JSXComponent).toExtend(BaseComponent);
  });

  describe('instance', () => {
    let instance;
    beforeEach(() => {
      instance = new TestableJSXComponent('signature', 'props');
    });

    it('should set a signature prop', () => {
      expect(instance.signature).toEqual('signature');
    });

    it('should set a props prop', () => {
      expect(instance.props).toEqual('props');
    });

    describe('canUpdate', () => {
      it('should be a function', () => {
        expect(instance.canUpdate).toBeInstanceOf(Function);
      });

      it('should be able to update if the next render is a class render', () => {
        let render = createRender({ signature: 'signature', props: {} });
        expect(instance.canUpdate(render)).toBe(true);
        render = createRender({ signature: function () {}, props: {} });
        expect(instance.canUpdate(render)).toBe(false);
        render = createRender('string');
        expect(instance.canUpdate(render)).toBe(false);
        render = createRender([]);
        expect(instance.canUpdate(render)).toBe(false);
        render = createRender();
        expect(instance.canUpdate(render)).toBe(false);
      });
    });

    describe('update', () => {
      it('should be a function', () => {
        expect(instance.update).toBeInstanceOf(Function);
      });

      it('should update the instance.instance.props property', () => {
        const newProps = {};
        instance.update(newProps);
        expect(instance.props).toBe(newProps);
      });
    });
  });
});