import { JSDOM } from 'jsdom';

import { DomContext } from '../DomContext';

describe('DomContext', () => {
  it('should be a class', () => {
    expect(DomContext).toBeAClass();
  });

  describe('instance', () => {
    let instance;
    beforeEach(() => {
      instance = new DomContext();
    });

    it('should have a jsdom instance', () => {
      expect(instance.dom).toBeDefined();
      expect(instance.dom).toBeInstanceOf(JSDOM);
    });

    describe('enable', () => {
      it('should be a function', () => {
        expect(instance.enable).toBeInstanceOf(Function);
      });

      it('should add a window object to global', () => {
        instance.enable();
        expect(window).toBeDefined();
        expect(window).toBe(instance.dom.window);
        instance.disable();
      });

      it('should add a document object to global', () => {
        instance.enable();
        expect(document).toBeDefined();
        expect(document).toBe(instance.dom.window.document);
        instance.disable();
      });

      it('should add a location object to global', () => {
        instance.enable();
        expect(location).toBeDefined();
        expect(location).toBe(instance.dom.window.location);
        instance.disable();
      });

      it('should add a Text object to global', () => {
        instance.enable();
        expect(Text).toBeDefined();
        expect(Text).toBe(instance.dom.window.Text);
        instance.disable();
      });
    });

    describe('disable', () => {
      it('should be a function', () => {
        expect(instance.disable).toBeInstanceOf(Function);
      });

      it('should remove the window object', () => {
        instance.enable();
        expect(window).toBeDefined();
        expect(window).toBe(instance.dom.window);
        instance.disable();
        expect(global.window).toBeUndefined();
      });

      it('should remove the document object', () => {
        instance.enable();
        expect(document).toBeDefined();
        expect(document).toBe(instance.dom.window.document);
        instance.disable();
        expect(global.document).toBeUndefined();
      });

      it('should remove the location object', () => {
        instance.enable();
        expect(location).toBeDefined();
        expect(location).toBe(instance.dom.window.location);
        instance.disable();
        expect(global.location).toBeUndefined();
      });

      it('should remove the Text object', () => {
        instance.enable();
        expect(Text).toBeDefined();
        expect(Text).toBe(instance.dom.window.Text);
        instance.disable();
        expect(global.Text).toBeUndefined();
      });
    });
  });
});