import { AppRender } from '../../AppRender';
import { InteractiveComponent } from '../abstract/InteractiveComponent';

import { FunctionComponent } from '../FunctionComponent';

describe('FunctionComponent', () => {
  it('should be a class', () => {
    expect(FunctionComponent).toBeInstanceOf(Function);
  });

  it('should extend InteractiveComponent', () => {
    expect(FunctionComponent).toExtend(InteractiveComponent);
  });

  describe('instance', () => {
    let instance;
    let renderFrameMock;
    let mockServices;
    const inputProps = {};
    const renderRef = jest.fn();
    const inputFn = jest.fn();

    let createHookContextMock;
    let createEffectContextMock;
    let destroyHookContextMock;
    let destroyEffectContextMock;
    let setActiveHookContextMock;
    let closeActiveHookContextMock;
    beforeEach(() => {
      renderFrameMock = jest.fn();
      createHookContextMock = jest.fn();
      createEffectContextMock = jest.fn();
      destroyHookContextMock = jest.fn();
      destroyEffectContextMock = jest.fn();
      setActiveHookContextMock = jest.fn();
      closeActiveHookContextMock = jest.fn();
      mockServices = {
        renderFrame: renderFrameMock,
        createHookContext: createHookContextMock,
        createEffectContext: createEffectContextMock,
        destroyHookContext: destroyHookContextMock,
        destroyEffectContext: destroyEffectContextMock,
        setActiveHookContext: setActiveHookContextMock,
        closeActiveHookContext: closeActiveHookContextMock,
      };
      instance = new FunctionComponent(inputFn, inputProps, mockServices);
    });

    afterEach(() => {
      jest.resetAllMocks();
      jest.resetModules();
    });

    it('should have a signature', () => {
      expect(instance.signature).toBe(inputFn);
    });

    it('should have an fn from input function', () => {
      expect(instance.fn).toEqual(inputFn);
    });

    it('should have props from the input props', () => {
      expect(instance.props).toBe(inputProps);
    });

    it('should initialize state set to 0', () => {
      expect(instance.state).toBe(0);
    });

    it('should call the createHookContextMock during instance construction', () => {
      expect(createHookContextMock).toHaveBeenCalledTimes(1);
      expect(createHookContextMock).toHaveBeenCalledWith(instance);
      new FunctionComponent(() => {}, {}, mockServices);
      expect(createHookContextMock).toHaveBeenCalledTimes(2);
    });

    it('should call the createEffectContextMock during instance construction', () => {
      expect(createEffectContextMock).toHaveBeenCalledTimes(1);
      expect(createEffectContextMock).toHaveBeenCalledWith(instance);
      new FunctionComponent(() => {}, {}, mockServices);
      expect(createEffectContextMock).toHaveBeenCalledTimes(2);
    });

    describe('canUpdate', () => {
      it('should be a function', () => {
        expect(instance.canUpdate).toBeInstanceOf(Function);
      });

      it('should be able to update if the next render is an function render', () => {
        const fn = function() {};
        let render = new AppRender({ signature: fn, props: {} });
        const localInstance = new FunctionComponent(fn, {}, mockServices);
        expect(localInstance.canUpdate(render)).toBe(true);
        render = new AppRender({ signature: function () {}, props: {} });
        expect(localInstance.canUpdate(render)).toBe(false);
        render = new AppRender('string');
        expect(localInstance.canUpdate(render)).toBe(false);
        render = new AppRender([]);
        expect(localInstance.canUpdate(render)).toBe(false);
        render = new AppRender();
        expect(localInstance.canUpdate(render)).toBe(false);
      });
    });

    describe('closeHooks', () => {
      it('should be a function', () => {
        expect(instance.closeHooks).toBeInstanceOf(Function);
      });

      it('should call the closeActiveHookContextMock', () => {
        instance.closeHooks();
        expect(closeActiveHookContextMock).toHaveBeenCalledTimes(1);
      });
    });

    describe('openHooks', () => {
      it('should be a function', () => {
        expect(instance.openHooks).toBeInstanceOf(Function);
      });

      it('should call the setActiveHookContextMock', () => {
        instance.openHooks();
        expect(setActiveHookContextMock).toHaveBeenCalledTimes(1);
        expect(setActiveHookContextMock).toHaveBeenCalledWith(instance);
      });
    });

    describe('destroyEffect', () => {
      it('should be a function', () => {
        expect(instance.destroyEffect).toBeInstanceOf(Function);
      });

      it('should call effectController.destroyEffect if there is an effect on the instance', () => {
        instance.destroyEffect();
        expect(destroyEffectContextMock).toHaveBeenCalledTimes(1);
        expect(destroyEffectContextMock).toHaveBeenCalledWith(instance);
      });
    });

    describe('componentWillUnmount', () => {
      it('should be a function', () => {
        expect(instance.componentWillUnmount).toBeInstanceOf(Function);
      });

      it('should execute hookController.destroyContext prior to unmounting', () => {
        instance.componentWillUnmount();
        expect(destroyHookContextMock).toHaveBeenCalledTimes(1);
        expect(destroyHookContextMock).toHaveBeenCalledWith(instance);
      });
    });

    describe('render', () => {
      it('should be a function', () => {
        expect(instance.render).toBeInstanceOf(Function);
      });

      it('should call inputFn with props and return the result', () => {
        inputFn.mockImplementationOnce(() => renderRef);
        const result = instance.render();
        expect(result).toEqual(renderRef);
        expect(inputFn).toHaveBeenCalledTimes(1);
        expect(inputFn).toHaveBeenCalledWith(inputProps);
      });

      it('should set an active context on the hook controller and close the active context after fn execution', () => {
        inputFn.mockImplementationOnce(() => renderRef);
        const result = instance.render();
        expect(result).toEqual(renderRef);
        expect(inputFn).toHaveBeenCalledTimes(1);
        expect(inputFn).toHaveBeenCalledWith(inputProps);
        expect(setActiveHookContextMock).toHaveBeenCalledTimes(1);
        expect(setActiveHookContextMock).toHaveBeenCalledWith(instance);
        expect(closeActiveHookContextMock).toHaveBeenCalledTimes(1);
      });
    });

    describe('update', () => {
      it('should be a function', () => {
        expect(instance.update).toBeInstanceOf(Function);
      });

      it('should update the props on the instance', () => {
        const newProps = {};
        instance.update(newProps);
        expect(instance.props).toBe(newProps);
      });
    });

    describe('writeState', () => {
      it('should be a function', () => {
        expect(instance.writeState).toBeInstanceOf(Function);
      });

      it('should increment state when called', () => {
        instance.writeState();
        expect(instance.state).toBe(1);
        instance.writeState();
        expect(instance.state).toBe(2);
      });
    });
  });
});
