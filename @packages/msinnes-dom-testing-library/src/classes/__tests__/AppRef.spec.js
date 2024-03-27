import { BaseAppRef } from '@internal/base';
import { SsrScope, parseConfig } from '@internal/ssr';
import { createElement } from '@internal/utils';

import { AppRef } from '../AppRef';

describe('AppRef', () => {
  it('should be a class', () => {
    expect(AppRef).toBeAClass();
  });

  it('should extend DomRef', () => {
    expect(AppRef).toExtend(BaseAppRef);
  });

  describe('instance', () => {
    let instance;
    let scope;
    beforeEach(() => {
      scope = new SsrScope(parseConfig({}));
      instance = new AppRef(scope.body.elem, scope);
    });

    it('should have the DomRef elem prop', () => {
      expect(instance.elem).toBe(scope.body.elem);
    });

    describe('hydrate', () => {
      it('should be a function', () => {
        expect(instance.hydrate).toBeInstanceOf(Function);
      });

      it('should hydrate an application with text children', () => {
        scope.body.elem.appendChild(
          scope.document.createTextNode('text')
        );
        expect(scope.body.elem.innerHTML).toEqual('text');
        instance.hydrate(createElement('div'));
        expect(scope.body.elem.innerHTML).toEqual('<div></div>');
      });

      it('should hydrate an application to an element with existing element children', () => {
        scope.body.elem.appendChild(
          scope.document.createElement('div')
        );
        expect(scope.body.elem.innerHTML).toEqual('<div></div>');
        instance.hydrate('text');
        expect(scope.body.elem.innerHTML).toEqual('text');
      });

      it('should return the instance', () => {
        scope.body.elem.appendChild(
          scope.document.createElement('div')
        );
        expect(scope.body.elem.innerHTML).toEqual('<div></div>');
        expect(instance.hydrate('text')).toBe(instance);
        expect(scope.body.elem.innerHTML).toEqual('text');
      });

      it('should be repeatedly dottable', () => {
        scope.body.elem.appendChild(
          scope.document.createElement('div')
        );
        expect(scope.body.elem.innerHTML).toEqual('<div></div>');
        instance.hydrate(createElement('div')).hydrate('text');
        expect(scope.body.elem.innerHTML).toEqual('text');
      });
    });

    describe('render', () => {
      it('should be a function', () => {
        expect(instance.render).toBeInstanceOf(Function);
      });

      it('should mount to the dom', () => {
        instance.render(createElement('div'));
        expect(scope.body.elem.innerHTML).toEqual('<div></div>');
      });

      it('should return the instance', () => {
        expect(instance.render('text')).toBe(instance);
        expect(scope.body.elem.innerHTML).toEqual('text');
      });

      it('should be repeatedly dottable', () => {
        instance.render('text').render(createElement('div'));
        expect(scope.body.elem.innerHTML).toEqual('<div></div>');
      });
    });

    describe('unmount', () => {
      it('should be a function', () => {
        expect(instance.unmount).toBeInstanceOf(Function);
      });

      it('should unmount a text hydrated dom', () => {
        scope.body.elem.appendChild(
          scope.document.createElement('div')
        );
        expect(scope.body.elem.innerHTML).toEqual('<div></div>');
        instance.hydrate('text');
        expect(scope.body.elem.innerHTML).toEqual('text');
        instance.unmount();
        expect(scope.body.elem.innerHTML).toEqual('');
      });

      it('should unmount a text rendered dom', () => {
        instance.render('text');
        expect(scope.body.elem.innerHTML).toEqual('text');
        instance.unmount();
        expect(scope.body.elem.innerHTML).toEqual('');
      });

      it('should unmount a div hydrated dom', () => {
        scope.body.elem.appendChild(
          scope.document.createElement('div')
        );
        expect(scope.body.elem.innerHTML).toEqual('<div></div>');
        instance.hydrate(createElement('div'));
        expect(scope.body.elem.innerHTML).toEqual('<div></div>');
        instance.unmount();
        expect(scope.body.elem.innerHTML).toEqual('');
      });

      it('should unmount a div rendered dom', () => {
        instance.render(createElement('div'));
        expect(scope.body.elem.innerHTML).toEqual('<div></div>');
        instance.unmount();
        expect(scope.body.elem.innerHTML).toEqual('');
      });

      it('should return the instance', () => {
        instance.render(createElement('div'));
        expect(scope.body.elem.innerHTML).toEqual('<div></div>');
        expect(instance.unmount()).toBe(instance);
        expect(scope.body.elem.innerHTML).toEqual('');
      });

      it('should not throw an error if there is no controller', () => {
        expect(() => instance.unmount()).not.toThrow();
      });
    });
  });
});
