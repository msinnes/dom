import { createRender } from '@new-internal/render'

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
    let services;
    beforeEach(() => {
      renderRef = {};
      propsRef = {};
      services = {
        pushFrame: jest.fn(),
      };
      instance = new ClassComponent(Component, propsRef);
      instance.services = services;
    });

    it('should set the correct component flags', () => {
      expect(instance.isJSXComponent).toBe(true);
      expect(instance.isClassComponent).toBe(true);
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

    describe('componentDidMount', () => {
      it('should be a function', () => {
        expect(instance.componentDidMount).toBeInstanceOf(Function);
      });

      it('should set instance.setState', () => {
        instance.componentDidMount();
        expect(instance.instance.setState).toBeInstanceOf(Function);
      });

      it('should call services.pushFrame when instance.setState is called', () => {
        const nextStateRef = {};
        instance.componentDidMount();
        instance.instance.setState(nextStateRef);
        expect(services.pushFrame).toHaveBeenCalledTimes(1);
        expect(services.pushFrame).toHaveBeenCalledWith(instance, nextStateRef);
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

    describe('writeState', () => {
      it('should be a function', () => {
        expect(instance.writeState).toBeInstanceOf(Function);
      });

      it('should write the next state to the instance', () => {
        const nextStateRef = {};
        instance.writeState(nextStateRef);
        expect(instance.instance.state).toBe(nextStateRef);
      });

      it('should execute nextState if the nextState is a function', () => {
        const nextStateMock = jest.fn();
        const nextState = prevState => nextStateMock(prevState);
        const lastStateRef = {};
        instance.instance.state = lastStateRef;
        const outputStateRef = {};
        nextStateMock.mockImplementation(() => outputStateRef);
        instance.writeState(nextState);
        expect(nextStateMock).toHaveBeenCalledTimes(1);
        expect(nextStateMock).toHaveBeenCalledWith(lastStateRef);
        expect(instance.instance.state).toBe(outputStateRef);
      });
    });
  });
});