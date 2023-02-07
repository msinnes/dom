/**
 * @jest-environment jsdom
 */
import { DomRef } from '@internal/dom';
import { createElement } from '@internal/utils';

import { AppRef } from '../AppRef';

describe('AppRef', () => {
  afterEach(() => {
    while(document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('should be a class', () => {
    expect(AppRef).toBeAClass();
  });

  it('should extend DomRef', () => {
    expect(AppRef).toExtend(DomRef);
  });

  describe('instance', () => {
    let instance;

    beforeEach(() => {
      instance = new AppRef(document.body);
    });

    it('should have the DomRef elem prop', () => {
      expect(instance.elem).toBe(document.body);
    });

    describe('hydrate', () => {
      it('should be a function', () => {
        expect(instance.hydrate).toBeInstanceOf(Function);
      });

      it('should hydrate an application with text children', () => {
        document.body.appendChild(
          document.createTextNode('text')
        );
        expect(document.body.innerHTML).toEqual('text');
        instance.hydrate(createElement('div'));
        expect(document.body.innerHTML).toEqual('<div></div>');
      });

      it('should hydrate an application to an element with existing element children', () => {
        document.body.appendChild(
          document.createElement('div')
        );
        expect(document.body.innerHTML).toEqual('<div></div>');
        instance.hydrate('text');
        expect(document.body.innerHTML).toEqual('text');
      });

      it('should return the instance', () => {
        document.body.appendChild(
          document.createElement('div')
        );
        expect(document.body.innerHTML).toEqual('<div></div>');
        expect(instance.hydrate('text')).toBe(instance);
        expect(document.body.innerHTML).toEqual('text');
      });

      it('should be repeatedly dottable', () => {
        document.body.appendChild(
          document.createElement('div')
        );
        expect(document.body.innerHTML).toEqual('<div></div>');
        instance.hydrate(createElement('div')).hydrate('text');
        expect(document.body.innerHTML).toEqual('text');
      });
    });

    describe('render', () => {
      it('should be a function', () => {
        expect(instance.render).toBeInstanceOf(Function);
      });

      it('should mount to the dom', () => {
        instance.render(createElement('div'));
        expect(document.body.innerHTML).toEqual('<div></div>');
      });

      it('should return the instance', () => {
        expect(instance.render('text')).toBe(instance);
        expect(document.body.innerHTML).toEqual('text');
      });

      it('should be repeatedly dottable', () => {
        instance.render('text').render(createElement('div'));
        expect(document.body.innerHTML).toEqual('<div></div>');
      });
    });

    describe('unmount', () => {
      it('should be a function', () => {
        expect(instance.unmount).toBeInstanceOf(Function);
      });

      it('should unmount a text hydrated dom', () => {
        document.body.appendChild(
          document.createElement('div')
        );
        expect(document.body.innerHTML).toEqual('<div></div>');
        instance.hydrate('text');
        expect(document.body.innerHTML).toEqual('text');
        instance.unmount();
        expect(document.body.innerHTML).toEqual('');
      });

      it('should unmount a text rendered dom', () => {
        instance.render('text');
        expect(document.body.innerHTML).toEqual('text');
        instance.unmount();
        expect(document.body.innerHTML).toEqual('');
      });

      it('should unmount a div hydrated dom', () => {
        document.body.appendChild(
          document.createElement('div')
        );
        expect(document.body.innerHTML).toEqual('<div></div>');
        instance.hydrate(createElement('div'));
        expect(document.body.innerHTML).toEqual('<div></div>');
        instance.unmount();
        expect(document.body.innerHTML).toEqual('');
      });

      it('should unmount a div rendered dom', () => {
        instance.render(createElement('div'));
        expect(document.body.innerHTML).toEqual('<div></div>');
        instance.unmount();
        expect(document.body.innerHTML).toEqual('');
      });

      it('should return the instance', () => {
        instance.render(createElement('div'));
        expect(document.body.innerHTML).toEqual('<div></div>');
        expect(instance.unmount()).toBe(instance);
        expect(document.body.innerHTML).toEqual('');
      });

      it('should not throw an error if there is no controller', () => {
        expect(() => instance.unmount()).not.toThrow();
      });
    });
  });
});