import { IdentitiveComponent } from '../abstract/IdentitiveComponent';
import { AppRender } from '../../AppRender';

import { TextComponent } from '../TextComponent';

describe('TextComponent', () => {
  it('should be a class', () => {
    expect(TextComponent).toBeInstanceOf(Function);
  });

  it('should extend IdentitiveComponent', () => {
    expect(TextComponent).toExtend(IdentitiveComponent);
  });

  describe('instance', () => {
    let instance;

    beforeEach(() => {
      instance = new TextComponent('text');
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should have a text prop', () => {
      expect(instance.text).toEqual('text');
    });

    describe('update', () => {
      it('should be a function', () => {
        expect(instance.update).toBeInstanceOf(Function);
      });

      it('should update the component\'s props', () => {
        instance.update('other text');
        expect(instance.text).toEqual('other text');
      });
    });

    describe('render', () => {
      it('should be a function', () => {
        expect(instance.render).toBeInstanceOf(Function);
      });

      it('should return the text prop from render', () => {
        expect(instance.render()).toEqual('text');
      });
    });

    describe('canUpdate', () => {
      it('should be a function', () => {
        expect(instance.canUpdate).toBeInstanceOf(Function);
      });

      it('should be able to update if the next render is an text render', () => {
        let render = new AppRender('string');
        expect(instance.canUpdate(render)).toBe(true);
        render = new AppRender({ signature: function () {}, props: {} });
        expect(instance.canUpdate(render)).toBe(false);
        render = new AppRender([]);
        expect(instance.canUpdate(render)).toBe(false);
        render = new AppRender();
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