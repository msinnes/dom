import { AppRender } from '../../AppRender';
import { AppComponent } from '../abstract/AppComponent';
import { SignatureComponent } from '../abstract/SignatureComponent';

import { ElementComponent } from '../ElementComponent';

describe('ElementComponent', () => {
  it('should be a class', () => {
    expect(ElementComponent).toBeInstanceOf(Function);
  });

  it('should extend SignatureComponent', () => {
    expect(ElementComponent).toExtend(SignatureComponent);
  });

  describe('instance', () => {
    let instance;
    const props = {};

    beforeEach(() => {
      instance = new ElementComponent('div', props);
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should put the element on the instance', () => {
      expect(instance.element).toEqual('div');
    });

    it('should put the props on the instance', () => {
      expect(instance.props).toBe(props);
    });

    describe('canUpdate', () => {
      it('should be a function', () => {
        expect(instance.canUpdate).toBeInstanceOf(Function);
      });

      it('should be able to update if the next render is an element render', () => {
        let render = new AppRender({ signature: 'div', props: {} });
        expect(instance.canUpdate(render)).toBe(true);
        render = new AppRender({ signature: 'p', props: {} });
        expect(instance.canUpdate(render)).toBe(false);
        render = new AppRender('string');
        expect(instance.canUpdate(render)).toBe(false);
        render = new AppRender([]);
        expect(instance.canUpdate(render)).toBe(false);
        render = new AppRender();
        expect(instance.canUpdate(render)).toBe(false);
      });
    });

    describe('getNextChildren', () => {
      it('should either return the appRender\'s chilren prop or an empty array', () => {
        const childRef = [];
        expect(instance.getNextChildren({ render: { children: childRef } })).toBe(childRef);
        const defaultOutput = instance.getNextChildren({ render: {} });
        expect(defaultOutput).toBeInstanceOf(Array);
        expect(defaultOutput.length).toEqual(0);
      });
    });

    describe('render', () => {
      it('should be a function', () => {
        expect(instance.render).toBeInstanceOf(Function);
      });

      it('should return a render object with the form: { signature: element, props: {}, children: [] }', () => {
        expect(instance.render()).toMatchObject({ signature: 'div', props, children: [] });
      });
    });

    describe('update', () => {
      it('should be a function', () => {
        expect(instance.update).toBeInstanceOf(Function);
      });

      it('should update instance props', () => {
        const newProps = {};
        instance.update(newProps);
        expect(instance.props).toBe(newProps);
      });
    });

    describe('resolve', () => {
      it('should be a function', () => {
        expect(instance.resolve).toBeInstanceOf(Function);
      });

      it('should return a render with resolved children', () => {
        const sig = 'div';
        const pr = {};
        const ref = {};
        const child = { resolve: () => ref };
        instance.update(pr);
        instance.appendChild(child);
        expect(instance.resolve()).toMatchObject({
          signature: sig,
          props: pr,
          children: [ref],
        })
      });
    });
  });
});