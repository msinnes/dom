import { JSDOM } from 'jsdom';

import { Scope } from '../../base/Scope';
import { TimeScope } from '../../time/TimeScope';

import { DomScope } from '../DomScope';

describe('DomScope', () => {
  it('should be a class', () => {
    expect(DomScope).toBeAClass();
  });

  it('should extends Scope', () => {
    expect(DomScope).toExtend(Scope);
  });

  describe('instance', () => {
    let instance;

    let mockTimeScope;
    beforeEach(() => {
      mockTimeScope = new TimeScope({ runExpiredTimers: true });
      instance = new DomScope({}, mockTimeScope);
    });

    it('should have a jsdom instance', () => {
      expect(instance.dom).toBeDefined();
      expect(instance.dom).toBeInstanceOf(JSDOM);
    });

    it('should set location if config.url is passed', () => {
      instance = new DomScope({ url: 'http://url.com/path?id=1#hash' }, mockTimeScope);
      const location = instance.dom.window.location;
      expect(location.href).toEqual('http://url.com/path?id=1#hash');
      expect(location.origin).toEqual('http://url.com');
      expect(location.pathname).toEqual('/path');
      expect(location.search).toEqual('?id=1');
      expect(location.hash).toEqual('#hash');
    });

    it('should overwrite timers on the window object', () => {
      const mockFn = jest.fn();
      let id = instance.dom.window.setTimeout(mockFn, 10);
      expect(mockTimeScope.timeouts.timers.length).toEqual(1);
      instance.dom.window.clearTimeout(id);
      expect(mockTimeScope.timeouts.timers.length).toEqual(0);
      id = instance.dom.window.setInterval(mockFn, 10);
      expect(mockTimeScope.intervals.timers.length).toEqual(1);
      instance.dom.window.clearInterval(id);
      expect(mockTimeScope.intervals.timers.length).toEqual(0);
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

      it('should add a PopStateEvent object to global', () => {
        instance.enable();
        expect(PopStateEvent).toBeDefined();
        expect(PopStateEvent).toBe(instance.dom.window.PopStateEvent);
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

      it('should remove the PopStateEvent object', () => {
        instance.enable();
        expect(PopStateEvent).toBeDefined();
        expect(PopStateEvent).toBe(instance.dom.window.PopStateEvent);
        instance.disable();
        expect(global.PopStateEvent).toBeUndefined();
      });
    });
  });
});
