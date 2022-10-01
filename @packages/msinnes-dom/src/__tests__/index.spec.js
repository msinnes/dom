/**
 * @jest-environment jsdom
 */
import {
  createRef,
  createContext,
  Component,
  renderApp,
  hydrateApp,
  createElement,
  cloneElement,
  // hooks
  useContext,
  useState,
  useMemo,
  useEffect,
  useRef,
} from '..';

describe('index', () => {
  describe('createRef', () => {
    it('should be a function', () => {
      expect(createRef).toBeInstanceOf(Function);
    });
  });

  describe('createContext', () => {
    it('should be a function', () => {
      expect(createContext).toBeInstanceOf(Function);
    });
  });

  describe('Component', () => {
    it('should be a class', () => {
      expect(Component).toBeInstanceOf(Function);
    });
  });

  describe('renderApp', () => {
    it('should be a function', () => {
      expect(renderApp).toBeInstanceOf(Function);
    });
  });

  describe('hydrateApp', () => {
    it('should be a function', () => {
      expect(hydrateApp).toBeInstanceOf(Function);
    });
  });

  describe('createElement', () => {
    it('should be a function', () => {
      expect(createElement).toBeInstanceOf(Function);
    });
  });

  describe('cloneElement', () => {
    it('should be a function', () => {
      expect(cloneElement).toBeInstanceOf(Function);
    });
  });

  describe('useContext', () => {
    it('should be a function', () => {
      expect(useContext).toBeInstanceOf(Function);
    });
  });

  describe('useState', () => {
    it('should be a function', () => {
      expect(useState).toBeInstanceOf(Function);
    });
  });

  describe('useMemo', () => {
    it('should be a function', () => {
      expect(useMemo).toBeInstanceOf(Function);
    });
  });

  describe('useEffect', () => {
    it('should be a function', () => {
      expect(useEffect).toBeInstanceOf(Function);
    });
  });

  describe('useRef', () => {
    it('should be a function', () => {
      expect(useRef).toBeInstanceOf(Function);
    });
  });
});
