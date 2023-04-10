import { createRender } from '@internal/render';

import { BaseComponent } from '../base/BaseComponent';

import { ArrayComponent } from '../ArrayComponent';

describe('ArrayComponent', () => {
  it('should be a class', () => {
    expect(ArrayComponent).toBeAClass();
  });

  it('should extend BaseComponent', () => {
    expect(ArrayComponent).toExtend(BaseComponent);
  });

  describe('instance', () => {
    let componentsRef;
    let instance;
    beforeEach(() => {
      componentsRef = [];
      instance = new ArrayComponent(componentsRef);
    });

    it('should set the correct component flags', () => {
      expect(instance.isArrayComponent).toBe(true);
    });

    it('should be an instance of BaseComponent', () => {
      expect(instance).toBeInstanceOf(BaseComponent);
    });

    it('should assign the components prop', () => {
      expect(instance.components).toBe(componentsRef);
    });

    describe('canUpdate', () => {
      it('should be a function', () => {
        expect(instance.canUpdate).toBeInstanceOf(Function);
      });

      it('should be able to update if the next render is an array render', () => {
        let render = createRender([]);
        expect(instance.canUpdate(render)).toBe(true);
        render = createRender({ signature: function () {}, props: {} });
        expect(instance.canUpdate(render)).toBe(false);
        render = createRender('string');
        expect(instance.canUpdate(render)).toBe(false);
        render = createRender();
        expect(instance.canUpdate(render)).toBe(false);
      });
    });

    describe('render', () => {
      it('should be a function', () => {
        expect(instance.render).toBeInstanceOf(Function);
      });

      it('should return the components prop from render', () => {
        expect(instance.render()).toEqual(instance.components);
      });
    });

    describe('update', () => {
      it('should be a function', () => {
        expect(instance.update).toBeInstanceOf(Function);
      });

      it('should update the component\'s props', () => {
        const nextComponents = [];
        instance.update(nextComponents);
        expect(instance.components).toEqual(nextComponents);
      });
    });
  });
});
