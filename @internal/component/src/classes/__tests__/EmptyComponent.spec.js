import { createRender } from '@internal/render';

import { BaseComponent } from '../base/BaseComponent';

import { EmptyComponent } from '../EmptyComponent';

describe('EmptyComponent', () => {
  it('should be a class', () => {
    expect(EmptyComponent).toBeAClass();
  });

  it('should extend BaseComponent', () => {
    expect(EmptyComponent).toExtend(BaseComponent);
  });

  describe('instance', () => {
    let instance;
    beforeEach(() => {
      instance = new EmptyComponent();
    });

    it('should set the correct component flags', () => {
      expect(instance.isEmptyComponent).toBe(true);
    });

    describe('canUpdate', () => {
      it('should be a function', () => {
        expect(instance.canUpdate).toBeInstanceOf(Function);
      });

      it('should be able to update if the next render is an emptyRender', () => {
        let render = createRender();
        expect(instance.canUpdate(render)).toBe(true);
        render = createRender(null);
        expect(instance.canUpdate(render)).toBe(true);
        render = createRender({ signature: function () {}, props: {} });
        expect(instance.canUpdate(render)).toBe(false);
        render = createRender('string');
        expect(instance.canUpdate(render)).toBe(false);
        render = createRender([]);
        expect(instance.canUpdate(render)).toBe(false);
      });
    });

    describe('render', () => {
      it('should be a function', () => {
        expect(instance.render).toBeInstanceOf(Function);
      });
    });

    describe('update', () => {
      it('update is defined, but noop', () => {
        expect(instance.update).toBeDefined();
      });
    });
  });
});
