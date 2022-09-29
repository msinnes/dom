import { AppRender } from '../../AppRender';
import { InteractiveComponent } from '../abstract/InteractiveComponent';

import { ClassComponent } from '../ClassComponent';

describe('ClassComponent', () => {
  it('should be a class', () => {
    expect(ClassComponent).toBeAClass();
  });

  it('should extend InteractiveComponent', () => {
    expect(ClassComponent).toExtend(InteractiveComponent);
  });

  describe('instance', () => {
    let instance;
    const props = {};
    const renderRef = {};
    function InputConstructor(props) {
      this.props = props;
      this.render = () => renderRef;
    }
    let renderFrameMock;
    let mockServices;

    beforeEach(() => {
      renderFrameMock = jest.fn();
      mockServices = {
        renderFrame: renderFrameMock,
        createEffectContext: jest.fn(),
        getContextValue: jest.fn(),
        destroyEffectContext: jest.fn(),
        addEffect: jest.fn(),
      };
      instance = new ClassComponent(InputConstructor, props, mockServices);
    });

    afterEach(() => {
      jest.resetAllMocks();
      jest.resetModules();
    });

    it('it should generate an instance from the input constructor', () => {
      expect(instance.signature).toEqual(InputConstructor);
      expect(instance.instance).toBeInstanceOf(InputConstructor);
      expect(instance.instance.props).toBe(props);
    });

    it('should expose a setState method on the made instance', () => {
      expect(instance.instance.setState).toBeInstanceOf(Function);
      instance.instance.setState(1);
      expect(renderFrameMock).toHaveBeenCalledTimes(1);
      expect(renderFrameMock).toHaveBeenCalledWith(instance, 1);
    });

    it('should expose componentDidMount if the input constructor has that lifecycle hook', () => {
      const didMountMock = jest.fn();
      class DidMountComponent {
        componentDidMount() {
          didMountMock();
        }
      }
      expect(instance.componentDidMount).toBeUndefined();
      const localInstance = new ClassComponent(DidMountComponent, {}, mockServices);
      expect(localInstance.componentDidMount).toBeInstanceOf(Function);
      localInstance.componentDidMount();
      expect(didMountMock).toHaveBeenCalledTimes(1);
    });

    it('should expose componentDidUpdate if the input constructor has that lifecycle hook', () => {
      const didUpdateMock = jest.fn();
      class DidUpdateComponent {
        componentDidUpdate() {
          didUpdateMock();
        }
      }
      expect(instance.componentDidUpdate).toBeUndefined();
      const localInstance = new ClassComponent(DidUpdateComponent, {}, mockServices);
      expect(localInstance.componentDidUpdate).toBeInstanceOf(Function);
      localInstance.componentDidUpdate();
      expect(didUpdateMock).toHaveBeenCalledTimes(1);
    });

    it('should expose componentWillUnmount if the input constructor has that lifecycle hook', () => {
      const willUnmountMock = jest.fn();
      class WillUnmountComponent {
        componentWillUnmount() {
          willUnmountMock();
        }
      }
      expect(instance.componentWillUnmount).toBeUndefined();
      const localInstance = new ClassComponent(WillUnmountComponent, {}, mockServices);
      expect(localInstance.componentWillUnmount).toBeInstanceOf(Function);
      localInstance.componentWillUnmount();
      expect(willUnmountMock).toHaveBeenCalledTimes(1);
    });

    it('should register an effect if one is on the input constructor and assign it to the domEffect prop', () => {
      const addEffectMock = mockServices.addEffect;
      const addEffectMockRef = {};
      const createContextMock = mockServices.createEffectContext;
      addEffectMock.mockImplementation(() => addEffectMockRef);
      class NoEffectComponent {}
      class EffectComponent {
        effect() {}
      }

      let localInstance = new ClassComponent(NoEffectComponent, {}, mockServices);
      expect(createContextMock).not.toHaveBeenCalled();
      expect(addEffectMock).not.toHaveBeenCalled();

      localInstance = new ClassComponent(EffectComponent, {}, mockServices);
      expect(createContextMock).toHaveBeenCalledTimes(1);
      expect(createContextMock).toHaveBeenCalledWith(localInstance);

      expect(addEffectMock).toHaveBeenCalledTimes(1);
      expect(addEffectMock).toHaveBeenCalledWith(localInstance, localInstance.instance.effect);

      expect(localInstance.domEffect).toBe(addEffectMockRef);
    });

    describe('canUpdate', () => {
      it('should be a function', () => {
        expect(instance.canUpdate).toBeInstanceOf(Function);
      });

      it('should be able to update if the next render is a class render', () => {
        let render = new AppRender({ signature: InputConstructor, props: {} });
        expect(instance.canUpdate(render)).toBe(true);
        render = new AppRender({ signature: function () {}, props: {} });
        expect(instance.canUpdate(render)).toBe(false);
        render = new AppRender('string');
        expect(instance.canUpdate(render)).toBe(false);
        render = new AppRender([]);
        expect(instance.canUpdate(render)).toBe(false);
        render = new AppRender();
        expect(instance.canUpdate(render)).toBe(false);
      });
    });

    describe('checkContext', () => {
      const contextRef = {};
      class ContextClass {
        static contextType = contextRef;
      }
      let localInstance;
      let getContextValueMock;
      beforeEach(() => {
        getContextValueMock = mockServices.getContextValue;
        localInstance = new ClassComponent(ContextClass, {}, mockServices);
        getContextValueMock.mockClear();
      });

      it('should be a function', () => {
        expect(instance.checkContext).toBeInstanceOf(Function);
        expect(localInstance.checkContext).toBeInstanceOf(Function);
      });

      it('should assign the context value to the instance if there is a static contextType on the class', () => {
        const contextValueRef = {};
        getContextValueMock.mockImplementation(() => contextValueRef);
        instance.checkContext();
        localInstance.checkContext();
        expect(getContextValueMock).toHaveBeenCalledTimes(1);
        expect(getContextValueMock).toHaveBeenCalledWith(contextRef);
        expect(instance.instance.context).toBeUndefined();
        expect(localInstance.instance.context).toBe(contextValueRef);
      });
    });

    describe('checkEffect', () => {
      let localInstanceWithEffect;
      let localInstanceWithEffectAndConditions;
      let mockSetShouldExecute;
      let mockConditions;
      class EffectComponent {
        effect() {}
      }
      class EffectAndConditions {
        effect() {}
        effectConditions() {
          return mockConditions;
        }
      }
      beforeEach(() => {
        mockConditions = [];
        mockServices.addEffect.mockImplementation(() => ({}));
        localInstanceWithEffect = new ClassComponent(EffectComponent, {}, mockServices);
        localInstanceWithEffectAndConditions = new ClassComponent(EffectAndConditions, {}, mockServices);
        mockSetShouldExecute = jest.fn();
        localInstanceWithEffect.domEffect.setShouldExecute = mockSetShouldExecute;
        localInstanceWithEffectAndConditions.domEffect.setShouldExecute = mockSetShouldExecute;
      });

      it('should be a function', () => {
        expect(instance.checkEffect).toBeInstanceOf(Function);
      });

      it('should call setShouldUpdate on an effect if there is an effect and the input instance has effectConditions', () => {
        localInstanceWithEffect.checkEffect();
        expect(mockSetShouldExecute).not.toHaveBeenCalled();
        localInstanceWithEffectAndConditions.checkEffect();
        expect(mockSetShouldExecute).toHaveBeenCalledTimes(1);
        expect(mockSetShouldExecute).toHaveBeenCalledWith(mockConditions);
      });
    });

    describe('destroyEffect', () => {
      let destroyContextMock;
      let localInstance;
      beforeEach(() => {
        class WithEffectComponent {
          effect() {}
        }
        destroyContextMock = mockServices.destroyEffectContext;
        localInstance = new ClassComponent(WithEffectComponent, {}, mockServices);
      });

      it('should be a function', () => {
        expect(instance.destroyEffect).toBeInstanceOf(Function);
      });

      it('should call effectController.destroyEffect if there is an effect on the instance', () => {
        instance.destroyEffect();
        expect(destroyContextMock).not.toHaveBeenCalled();
        localInstance.destroyEffect();
        expect(destroyContextMock).toHaveBeenCalledTimes(1);
        expect(destroyContextMock).toHaveBeenCalledWith(localInstance);
      });
    });

    describe('render', () => {
      it('should be a function', () => {
        expect(instance.render).toBeInstanceOf(Function);
      });

      it('should return the output of the instance.instance.render method', () => {
        const output = instance.render();
        expect(output).toEqual(renderRef);
      });

      it('should call the checkContext fn', () => {
        const checkContextMock = jest.fn();
        instance.checkContext = checkContextMock;
        instance.render();
        expect(checkContextMock).toHaveBeenCalledTimes(1);
      });

      it('should call the checkEffect fn', () => {
        const checkEffectMock = jest.fn();
        instance.checkEffect = checkEffectMock;
        instance.render();
        expect(checkEffectMock).toHaveBeenCalledTimes(1);
      });
    });

    describe('update', () => {
      it('should be a function', () => {
        expect(instance.update).toBeInstanceOf(Function);
      });

      it('should update the instance.instance.props property', () => {
        const newProps = {};
        instance.update(newProps);
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
