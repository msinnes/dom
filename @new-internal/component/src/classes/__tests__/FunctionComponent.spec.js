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
    beforeEach(() => {
      renderFn = jest.fn();
      propsRef = {};
      instance = new FunctionComponent(renderFn, propsRef);
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