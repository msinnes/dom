import { createRender } from '@new-internal/render';

import { JSXComponent } from '../base/JSXComponent';

import { FunctionComponent } from '../FunctionComponent';

describe('FunctionComponent', () => {
  it('should be a class', () => {
    expect(FunctionComponent).toBeAClass();
  });

  it('should extend JSXComponent', () => {
    expect(FunctionComponent).toExtend(JSXComponent);
  });

  describe('instance', () => {
    let renderFn;
    let instance;
    let propsRef;
    let services;
    beforeEach(() => {
      renderFn = jest.fn();
      propsRef = {};
      services = {
        registerInstance: jest.fn(),
        destroyInstance: jest.fn(),
        closeActiveHookInstance: jest.fn(),
        setActiveHookInstance: jest.fn(),
        pushFrame: jest.fn(),
      };
      instance = new FunctionComponent(renderFn, propsRef);
      instance.services = services;
    });

    it('should set the correct component flags', () => {
      expect(instance.isJSXComponent).toBe(true);
      expect(instance.isFunctionComponent).toBe(true);
    });

    it('should be an instance of JSXComponent', () => {
      expect(instance).toBeInstanceOf(JSXComponent);
    });

    describe('canUpdate', () => {
      it('should be a function', () => {
        expect(instance.canUpdate).toBeInstanceOf(Function);
      });

      it('should be able to update if the next render is an function render', () => {
        const fn = function() {};
        let render = createRender({ signature: fn, props: {} });
        const localInstance = new FunctionComponent(fn, {});
        expect(localInstance.canUpdate(render)).toBe(true);
        render = createRender({ signature: function () {}, props: {} });
        expect(localInstance.canUpdate(render)).toBe(false);
        render = createRender('string');
        expect(localInstance.canUpdate(render)).toBe(false);
        render = createRender([]);
        expect(localInstance.canUpdate(render)).toBe(false);
        render = createRender();
        expect(localInstance.canUpdate(render)).toBe(false);
      });
    });

    describe('componentDidMount', () => {
      it('should be a function', () => {
        expect(instance.componentDidMount).toBeInstanceOf(Function);
      });

      it('should register the instance with the hook service', () => {
        instance.componentDidMount();
        expect(services.registerInstance).toHaveBeenCalledTimes(1);
        expect(services.registerInstance).toHaveBeenCalledWith(instance);
      });
    });

    describe('componentWillUnmount', () => {
      it('should be a function', () => {
        expect(instance.componentWillUnmount).toBeInstanceOf(Function);
      });

      it('should remove the instance from the hook service', () => {
        instance.componentWillUnmount();
        expect(services.destroyInstance).toHaveBeenCalledTimes(1);
        expect(services.destroyInstance).toHaveBeenCalledWith(instance);
      });
    });

    describe('render', () => {
      it('should be a function', () => {
        expect(instance.render).toBeInstanceOf(Function);
      });

      it('should call renderFn with props and return the result', () => {
        const renderRef = {};
        renderFn.mockImplementationOnce(() => renderRef);
        const result = instance.render();
        expect(result).toBeInstanceOf(Array);
        expect(result.length).toEqual(1);
        expect(result[0]).toEqual(renderRef);
        expect(renderFn).toHaveBeenCalledTimes(1);
        expect(renderFn.mock.calls[0][0]).toBe(propsRef);
      });

      it('should call the hookMocks', () => {
        const renderRef = {};
        renderFn.mockImplementationOnce(() => renderRef);
        const result = instance.render();
        expect(result[0]).toEqual(renderRef);
        expect(services.setActiveHookInstance).toHaveBeenCalledTimes(1);
        expect(services.setActiveHookInstance).toHaveBeenCalledWith(instance);
        expect(services.closeActiveHookInstance).toHaveBeenCalledTimes(1);
      });
    });

    describe('setState', () => {
      it('should be a function', () => {
        expect(instance.setState).toBeInstanceOf(Function);
      });

      it('should pass the hook and next state to the renderFrame handler', () => {
        const hookRef = {};
        const nextStateRef = {};
        instance.setState(hookRef, nextStateRef);
        expect(services.pushFrame).toHaveBeenCalledTimes(1);
        expect(services.pushFrame).toHaveBeenCalledWith(hookRef, nextStateRef);
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
  });
});