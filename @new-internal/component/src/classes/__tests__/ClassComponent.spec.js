import { createRender } from '@new-internal/render';

import { JSXComponent } from '../base/JSXComponent';

import { ClassComponent } from '../ClassComponent';

describe('ClassComponent', () => {
  it('should be a class', () => {
    expect(ClassComponent).toBeAClass();
  });

  it('should extend JSXComponent', () => {
    expect(ClassComponent).toExtend(JSXComponent);
  });

  describe('instance', () => {
    let renderRef;
    class Component {
      constructor(props) {
        this.props = props;
      }

      render() {
        return renderRef;
      }
    }
    let instance;
    let propsRef;
    beforeEach(() => {
      renderRef = {};
      propsRef = {};
      instance = new ClassComponent(Component, propsRef);
    });

    it('should be an instance of JSXComponent', () => {
      expect(instance).toBeInstanceOf(JSXComponent);
    });

    it('should set a signature prop', () => {
      expect(instance.signature).toEqual(Component);
    });

    it('should set a props prop', () => {
      expect(instance.props).toBe(propsRef);
    });

    it('it should generate an instance from the input constructor', () => {
      expect(instance.instance).toBeInstanceOf(Component);
      expect(instance.instance.props).toBe(propsRef);
    });

    describe('canUpdate', () => {
      it('should be a function', () => {
        expect(instance.canUpdate).toBeInstanceOf(Function);
      });

      it('should be able to update if the next render is a class render', () => {
        let render = createRender({ signature: Component, props: {} });
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

    describe('render', () => {
      it('should be a function', () => {
        expect(instance.render).toBeInstanceOf(Function);
      });

      it('should return the output of the instance.instance.render method', () => {
        const output = instance.render();
        expect(output).toBeInstanceOf(Array);
        expect(output.length).toEqual(1);
        expect(output[0]).toEqual(renderRef);
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
        expect(instance.instance.props).toBe(newProps);
      });
    });
  });
});