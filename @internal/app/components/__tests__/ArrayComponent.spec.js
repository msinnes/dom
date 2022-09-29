import { AppRender } from '../../AppRender'
import { AppComponent } from '../abstract/AppComponent';

import { ArrayComponent } from '../ArrayComponent';

describe('ArrayComponent', () => {
  it('should be a class', () => {
    expect(ArrayComponent).toBeAClass();
  });

  it('should extend BaseRenderer', () => {
    expect(ArrayComponent).toExtend(AppComponent);
  });

  describe('instance', () => {
    let instance;

    beforeEach(() => {
      instance = new ArrayComponent(['text']);
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    describe('update', () => {
      it('should be a function', () => {
        expect(instance.update).toBeInstanceOf(Function);
      });

      it('should update the component\'s props', () => {
        const nextComponents = ['next text'];
        instance.update(nextComponents);
        expect(instance.components).toEqual(nextComponents);
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

    describe('canUpdate', () => {
      it('should be a function', () => {
        expect(instance.canUpdate).toBeInstanceOf(Function);
      });

      it('should be able to update if the next render is an array render', () => {
        let render = new AppRender([]);
        expect(instance.canUpdate(render)).toBe(true);
        render = new AppRender({ signature: function () {}, props: {} });
        expect(instance.canUpdate(render)).toBe(false);
        render = new AppRender('string');
        expect(instance.canUpdate(render)).toBe(false);
        render = new AppRender();
        expect(instance.canUpdate(render)).toBe(false);
      });
    });

    describe('getNextChildren', () => {
      it('should be a function', () => {
        expect(instance.getNextChildren).toBeInstanceOf(Function);
      });

      it('should return the appRender.render prop', () => {
        const renderRef = [];
        expect(instance.getNextChildren({ render: renderRef })).toBe(renderRef);
      });
    });

    describe('resolve', () => {
      it('should be a function', () => {
        expect(instance.resolve).toBeInstanceOf(Function);
      });

      it('should return this instance children resolved', () => {
        const ref = {};
        const comp = { resolve: () => ref };
        instance.appendChild(comp);
        const resolved = instance.resolve();
        expect(resolved.length).toBe(1);
        expect(resolved[0]).toBe(ref);
      });
    });
  });
});