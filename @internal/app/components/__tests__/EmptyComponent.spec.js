import { IdentitiveComponent } from '../abstract/IdentitiveComponent';
import { AppRender } from '../../AppRender';

import { EmptyComponent } from '../EmptyComponent';

describe('EmptyComponent', () => {
  it('should be a class', () => {
    expect(EmptyComponent).toBeAClass();
  });

  it('should extend IdentitiveComponent', () => {
    expect(EmptyComponent).toExtend(IdentitiveComponent);
  });

  describe('instance', () => {
    let instance;

    beforeEach(() => {
      instance = new EmptyComponent();
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    describe('update', () => {
      it('update is defined, but noop', () => {
        expect(instance.update).toBeDefined();
      });
    });

    describe('render', () => {
      it('should be a function', () => {
        expect(instance.render).toBeInstanceOf(Function);
      });

      it('should return null from render', () => {
        expect(instance.render()).toEqual(null);
      });
    });

    describe('canUpdate', () => {
      it('should be a function', () => {
        expect(instance.canUpdate).toBeInstanceOf(Function);
      });

      it('should be able to update if the next render is an emptyRender', () => {
        let render = new AppRender();
        expect(instance.canUpdate(render)).toBe(true);
        render = new AppRender(null);
        render = new AppRender({ signature: function () {}, props: {} });
        expect(instance.canUpdate(render)).toBe(false);
        render = new AppRender('string');
        expect(instance.canUpdate(render)).toBe(false);
        render = new AppRender([]);
        expect(instance.canUpdate(render)).toBe(false);
      });
    });

    describe('getNextChildren', () => {
      it('should be a function', () => {
        expect(instance.getNextChildren).toBeInstanceOf(Function);
      });

      it('should return an empty array', () => {
        const out = instance.getNextChildren({});
        expect(out).toBeInstanceOf(Array);
        expect(out.length).toBe(0);
      });
    });
  });
});