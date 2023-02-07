import { createRender } from '@internal/render';

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
        addClassEffect: jest.fn(),
        getContextValue: jest.fn(),
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

    describe('checkContext', () => {
      const contextRef = {};
      class ContextClass {
        static contextType = contextRef;
      }
      let localInstance;
      beforeEach(() => {
        localInstance = new ClassComponent(ContextClass, {});
        localInstance.services = services;
      });

      it('should be a function', () => {
        expect(instance.checkContext).toBeInstanceOf(Function);
      });

      it('should assign the context value to the instance if there is a static contextType on the class', () => {
        const contextValueRef = {};
        services.getContextValue.mockImplementation(() => contextValueRef);
        instance.checkContext();
        localInstance.checkContext();
        expect(services.getContextValue).toHaveBeenCalledTimes(1);
        expect(services.getContextValue).toHaveBeenCalledWith(contextRef);
        expect(instance.instance.context).toBeUndefined();
        expect(localInstance.instance.context).toBe(contextValueRef);
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

      it('should call addClassEffect if the instance has componentDidMount', () => {
        instance.componentDidMount();
        expect(services.addClassEffect).toHaveBeenCalledTimes(0);
        instance.instance = { componentDidMount: jest.fn() };
        instance.componentDidMount();
        expect(services.addClassEffect).toHaveBeenCalledTimes(1);
        services.addClassEffect.mock.calls[0][0]();
        expect(instance.instance.componentDidMount).toHaveBeenCalledTimes(1);
      });
    });

    describe('componentDidUpdate', () => {
      it('should be a function', () => {
        expect(instance.componentDidUpdate).toBeInstanceOf(Function);
      });

      it('should call addClassEffect if the instance has componentDidUpdate', () => {
        instance.componentDidUpdate();
        expect(services.addClassEffect).toHaveBeenCalledTimes(0);
        instance.instance = { componentDidUpdate: jest.fn() };
        instance.componentDidUpdate();
        expect(services.addClassEffect).toHaveBeenCalledTimes(1);
        services.addClassEffect.mock.calls[0][0]();
        expect(instance.instance.componentDidUpdate).toHaveBeenCalledTimes(1);
      });
    });

    describe('componentWillUnmount', () => {
      it('should be a function', () => {
        expect(instance.componentWillUnmount).toBeInstanceOf(Function);
      });

      it('should componentWillUnmount if the instance has componentWillUnmount', () => {
        instance.componentWillUnmount();
        expect(services.addClassEffect).toHaveBeenCalledTimes(0);
        instance.instance = { componentWillUnmount: jest.fn() };
        instance.componentWillUnmount();
        expect(instance.instance.componentWillUnmount).toHaveBeenCalledTimes(1);
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

      it('should call checkContext', () => {
        const checkContextMock = jest.spyOn(instance, 'checkContext');
        instance.render();
        expect(checkContextMock).toHaveBeenCalledTimes(1);
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
