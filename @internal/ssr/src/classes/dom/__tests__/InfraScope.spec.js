/**
 * @jest-environment jsdom
 */
import { BaseAppRef } from '@internal/base';
import * as Dom from '@msinnes/dom';
import { Infra } from '@internal/infra';

import { Scope } from '../../base/Scope';

import { InfraScope } from '../InfraScope';

class MockAppRef extends BaseAppRef {}

describe('InfraScope', () => {
  it('should be a class', () => {
    expect(InfraScope).toBeAClass();
  });

  it('should extends Scope', () => {
    expect(InfraScope).toExtend(Scope);
  });

  describe('instance', () => {
    let instance;
    let infra;

    let createRefOriginal;
    let useContextOriginal;
    let useEffectOriginal;
    let useMemoOriginal;
    let useRefOriginal;
    let useStateOriginal;
    beforeEach(() => {
      infra = new Infra();
      instance = new InfraScope(infra, MockAppRef);

      createRefOriginal = Dom.createRef;
      useContextOriginal = Dom.useContext;
      useEffectOriginal = Dom.useEffect;
      useMemoOriginal = Dom.useMemo;
      useRefOriginal = Dom.useRef;
      useStateOriginal = Dom.useState;
    });

    it('should expose contextService', () => {
      expect(instance.contextService).toBe(infra.contextService);
    });

    it('should expose hooks', () => {
      expect(instance.hooks).toBe(infra.hooks);
    });

    it('should expose services', () => {
      expect(instance.services).toBe(infra.services);
    });

    it('should expose AppRef', () => {
      expect(instance.AppRef).toBe(MockAppRef);
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

      it('should overwrite useRef functionality', () => {
        instance.enable();
        expect(Dom.useRef).not.toBe(useRefOriginal);
        instance.disable();
      });

      it('should overwrite useState functionality', () => {
        instance.enable();
        expect(Dom.useState).toBe(instance.hooks.useState);
        instance.disable();
      });

      it('should overwrite Dom.createRef', () => {
        instance.enable();
        expect(Dom.createRef).not.toBe(createRefOriginal);
        expect(Dom.createRef).toBeInstanceOf(Function);
        expect(Dom.createRef('div')).toBeInstanceOf(MockAppRef);
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

      it('should reset useRef functionality', () => {
        instance.enable();
        expect(Dom.useRef).not.toBe(useRefOriginal);
        instance.disable();
        expect(Dom.useRef).toBe(useRefOriginal);
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

      it('should reset the createRef functionality', () => {
        instance.enable();
        expect(Dom.createRef).not.toBe(createRefOriginal);
        instance.disable();
        expect(Dom.createRef).toBe(createRefOriginal);
      });
    });
  });
});
