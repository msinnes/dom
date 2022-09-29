import * as Dom from '@msinnes/dom';

import { InfraContext } from '../InfraContext';

describe('InfraContext', () => {
  afterEach(() => {
    jest.resetModules();
  });

  it('should be a class', () => {
    expect(InfraContext).toBeAClass();
  });

  describe('instance', () => {
    let instance;

    let createContextOriginal;
    let useContextOriginal;
    let useEffectOriginal;
    let useMemoOriginal;
    let useStateOriginal;
    beforeEach(() => {
      instance = new InfraContext();
      createContextOriginal = Dom.createContext;
      useContextOriginal = Dom.useContext;
      useEffectOriginal = Dom.useEffect;
      useMemoOriginal = Dom.useMemo;
      useStateOriginal = Dom.useState;
    });

    it('should have a services prop', () => {
      expect(instance.services).toBeDefined();
      expect(instance.services).toBeInstanceOf(Object);
    });

    it('should have a hooks prop', () => {
      expect(instance.hooks).toBeDefined();
      expect(instance.hooks).toBeInstanceOf(Object);
    });

    describe('enable', () => {
      it('should be a function', () => {
        expect(instance.enable).toBeInstanceOf(Function);
      });

      it('should overwrite useContext functionality', () => {
        instance.enable();
        expect(Dom.useContext).toBe(instance.hooks.useContext);
        instance.disable();
      });

      it('should overwrite useEffect functionality', () => {
        instance.enable();
        expect(Dom.useEffect).toBe(instance.hooks.useEffect);
        instance.disable();
      });

      it('should overwrite useMemo functionality', () => {
        instance.enable();
        expect(Dom.useMemo).toBe(instance.hooks.useMemo);
        instance.disable();
      });

      it('should overwrite useState functionality', () => {
        instance.enable();
        expect(Dom.useState).toBe(instance.hooks.useState);
        instance.disable();
      });
    });

    describe('disable', () => {
      it('should be a function', () => {
        expect(instance.disable).toBeInstanceOf(Function);
      });

      it('should reset useContext functionality', () => {
        instance.enable();
        expect(Dom.useContext).toBe(instance.hooks.useContext);
        instance.disable();
        expect(Dom.useContext).toBe(useContextOriginal);
      });

      it('should reset useEffect functionality', () => {
        instance.enable();
        expect(Dom.useEffect).toBe(instance.hooks.useEffect);
        instance.disable();
        expect(Dom.useEffect).toBe(useEffectOriginal);
      });

      it('should reset useMemo functionality', () => {
        instance.enable();
        expect(Dom.useMemo).toBe(instance.hooks.useMemo);
        instance.disable();
        expect(Dom.useMemo).toBe(useMemoOriginal);
      });

      it('should reset useState functionality', () => {
        instance.enable();
        expect(Dom.useState).toBe(instance.hooks.useState);
        instance.disable();
        expect(Dom.useState).toBe(useStateOriginal);
      });
    });
  });
});