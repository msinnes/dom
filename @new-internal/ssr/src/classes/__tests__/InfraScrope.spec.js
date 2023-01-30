import * as Dom from '@new-msinnes/dom';
import { Infra } from '@new-internal/infra';

import { InfraScope } from '../InfraScope';

describe('InfraScope', () => {
  it('should be a class', () => {
    expect(InfraScope).toBeAClass();
  });

  describe('instance', () => {
    let instance;
    let infra;

    let createContextOriginal;
    let useContextOriginal;
    let useEffectOriginal;
    let useMemoOriginal;
    let useStateOriginal;
    beforeEach(() => {
      infra = new Infra();
      instance = new InfraScope(infra);

      createContextOriginal = Dom.createContext;
      useContextOriginal = Dom.useContext;
      useEffectOriginal = Dom.useEffect;
      useMemoOriginal = Dom.useMemo;
      useStateOriginal = Dom.useState;
    });

    it('should expose hooks', () => {
      expect(instance.hooks).toBe(infra.hooks);
    });

    it('should expose services', () => {
      expect(instance.services).toBe(infra.services);
    });

    describe('enable', () => {
      it('should be a function', () => {
        expect(instance.enable).toBeInstanceOf(Function);
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
