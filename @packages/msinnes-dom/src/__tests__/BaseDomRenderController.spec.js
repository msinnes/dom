/**
 * @jest-environment jsdom
 */
import { BaseRenderController } from '@internal/base/BaseRenderController';
import { DomRenderer } from '@internal/dom/DomRenderer';
import { DomElement } from '@internal/dom/DomElement';
import { DomRef } from '@internal/dom/DomRef';
import { BaseAppRenderer } from '@internal/app/AppRenderer';
import { AppComponent } from '@internal/app/components/abstract/AppComponent';

import { FrameQueue } from '@internal/frame/FrameQueue';
import createElement from '@internal/utils/createElement';

import { BaseDomRenderController } from '../BaseDomRenderController';

import { services } from '../infra';

class TestableRenderController extends BaseDomRenderController {}

describe('BaseDomRenderController', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be a class', () => {
    expect(BaseDomRenderController).toBeAClass();
  });

  it('should extend BaseRenderController', () => {
    expect(BaseDomRenderController).toExtend(BaseRenderController)
  });

  describe('instance', () => {
    let instance;
    let rootRender;
    beforeEach(() => {
      rootRender = createElement('div');
      instance = new TestableRenderController(rootRender, document.body);
    });

    afterEach(jest.resetAllMocks);

    it('should have a queue prop', () => {
      expect(instance.queue).toBeInstanceOf(FrameQueue);
    });

    it('should have a domRenderer prop', () => {
      expect(instance.domRenderer).toBeDefined();
      expect(instance.domRenderer).toBeInstanceOf(DomRenderer);
      expect(instance.domRenderer.root.elem).toBeInstanceOf(DomElement);
      expect(instance.domRenderer.root.elem.ref).toBeInstanceOf(DomRef);
      expect(instance.domRenderer.root.elem.elem).toBe(document.body);
    });

    it('should have an appRenderer prop', () => {
      expect(instance.appRenderer).toBeDefined();
      expect(instance.appRenderer).toBeInstanceOf(BaseAppRenderer);
      expect(instance.appRenderer.root).toBeInstanceOf(AppComponent);
      expect(instance.appRenderer.root.render()).toBe(rootRender);
    });

    it('should have a renderTimeoutId property defaulted to null', () => {
      expect(instance.renderTimeoutId).toBeDefined();
      expect(instance.renderTimeoutId).toBe(null);
    });

    describe('render', () => {
      it('should be a function', () => {
        expect(instance.render).toBeInstanceOf(Function);
      });

      it('call renderAppFrame when there are items in the queue', () => {
        const resolveMock = jest.fn();
        const renderMock = jest.fn();
        const renderAppMock = jest.fn();
        const renderAppFrameMock = jest.fn();
        const domRenderRef = {};
        const domFirstChildRef = {};
        resolveMock.mockImplementation(() => domRenderRef);
        instance.appRenderer.resolve = resolveMock;
        instance.domRenderer.root.children[0] = domFirstChildRef;
        instance.domRenderer.render = renderMock;
        instance.renderApp = renderAppMock;
        instance.renderAppFrame = renderAppFrameMock;
        instance.queue.add({}, {});
        instance.render();
        expect(renderAppMock).not.toHaveBeenCalled();
        expect(resolveMock).not.toHaveBeenCalled();
        expect(renderMock).not.toHaveBeenCalled();
        expect(renderAppFrameMock).toHaveBeenCalledTimes(1);
      });

      it('should render to the dom when the app render queue is empty', () => {
        const resolveMock = jest.fn();
        const renderMock = jest.fn();
        const renderAppMock = jest.fn();
        const renderAppFrameMock = jest.fn();
        const domRenderRef = {};
        const domFirstChildRef = {};
        resolveMock.mockImplementation(() => domRenderRef);
        instance.appRenderer.resolve = resolveMock;
        instance.domRenderer.root.children[0] = domFirstChildRef;
        instance.domRenderer.render = renderMock;
        instance.renderApp = renderAppMock;
        instance.renderAppFrame = renderAppFrameMock;
        instance.render();
        expect(renderAppMock).toHaveBeenCalledTimes(1);
        expect(resolveMock).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledTimes(1);
        expect(renderAppFrameMock).not.toHaveBeenCalled();
        expect(renderMock).toHaveBeenCalledWith(domRenderRef, instance.domRenderer.root, domFirstChildRef);
      });
    });

    describe('renderApp', () => {
      it('should be a function', () => {
        expect(instance.renderApp).toBeInstanceOf(Function);
      });

      it('should perform a root render on the app', () => {
        const rootRenderRef = {};
        const renderMock = jest.fn();
        const rootRenderMock = jest.fn();
        const rootFirstChildRef = {};
        rootRenderMock.mockImplementation(() => rootRenderRef);
        instance.appRenderer.root.render = rootRenderMock;
        instance.appRenderer.root.appendChild(rootFirstChildRef);
        instance.appRenderer.render = renderMock;
        instance.renderApp();
        expect(rootRenderMock).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledWith(rootRenderRef, instance.appRenderer.root, rootFirstChildRef);
      });
    });

    describe('renderAppFrame', () => {
      it('should be a function', () => {
        expect(instance.renderAppFrame).toBeInstanceOf(Function);
      });

      it('should pull the next frame, call the frame write method, and then call renderAsync', () => {
        const nextMock = jest.fn();
        const writeMock = jest.fn();
        const renderAsyncMock = jest.fn();
        const frameMock = { write: writeMock };
        nextMock.mockImplementation(() => frameMock);
        instance.queue.next = nextMock;
        instance.renderAsync = renderAsyncMock;
        instance.renderAppFrame();
        expect(nextMock).toHaveBeenCalledTimes(1);
        expect(writeMock).toHaveBeenCalledTimes(1);
        expect(renderAsyncMock).toHaveBeenCalledTimes(1);
      });
    });

    describe('renderAsync', () => {
      it('should be a function', () => {
        expect(instance.renderAsync).toBeInstanceOf(Function);
      });

      it('should call the render function asynchronously', done => {
        const renderMock = jest.fn();
        instance.render = renderMock;
        instance.renderAsync();
        expect(renderMock).not.toHaveBeenCalled();
        setTimeout(() => {
          expect(renderMock).toHaveBeenCalledTimes(1);
          done();
        });
      });
    });

    describe('renderDom', () => {
      it('should be a function', () => {
        expect(instance.renderDom).toBeInstanceOf(Function);
      });

      it('should resolve the app and render the dom', () => {
        const resolveMock = jest.fn();
        const renderMock = jest.fn();
        const domRenderRef = {};
        const firstChildRef = {};
        resolveMock.mockImplementation(() => domRenderRef);
        instance.appRenderer.resolve = resolveMock;
        instance.domRenderer.render = renderMock;
        instance.domRenderer.root.children[0] = firstChildRef;
        instance.renderDom();
        expect(resolveMock).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledWith(domRenderRef, instance.domRenderer.root, firstChildRef);
      });

      it('should call effectController.digest', () => {
        const digestMock = jest.spyOn(services, 'digestEffects');

        const resolveMock = jest.fn();
        const renderMock = jest.fn();
        const domRenderRef = {};
        const firstChildRef = {};
        resolveMock.mockImplementation(() => domRenderRef);
        instance.appRenderer.resolve = resolveMock;
        instance.domRenderer.render = renderMock;
        instance.domRenderer.root.children[0] = firstChildRef;
        instance.renderDom();
        expect(resolveMock).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledWith(domRenderRef, instance.domRenderer.root, firstChildRef);
        expect(digestMock).toHaveBeenCalledTimes(1);
      });
    });

    describe('renderFrame', () => {
      it('should be a function', () => {
        expect(instance.renderFrame).toBeInstanceOf(Function);
      });

      it('should throw an error if the component tries to update state during the render cycle', () => {
        instance.appRenderer.renderingComponent = true;
        expect(() => {
          instance.renderFrame({}, {});
        }).toThrow('ImplementationError: setState cannot be called during the render cycle');
      });

      it('should push the frame to the frame queue', () => {
        const addMock = jest.fn();
        const instanceRef = {};
        const nextStateRef = {};
        instance.queue.add = addMock;
        instance.renderFrame(instanceRef, nextStateRef);
        expect(addMock).toHaveBeenCalledTimes(1);
        expect(addMock).toHaveBeenCalledWith(instanceRef, nextStateRef);
      });

      it('should call the render method after the stack has cleared', done => {
        const renderMock = jest.fn();
        instance.render = renderMock;
        const addMock = jest.fn();
        const instanceRef = {};
        const nextStateRef = {};
        instance.queue.add = addMock;
        instance.renderFrame(instanceRef, nextStateRef);
        expect(renderMock).toHaveBeenCalledTimes(0);
        setTimeout(() => {
          expect(renderMock).toHaveBeenCalledTimes(1);
          done();
        });
      });

      it('should only call the render method once if multiple frames are pushed', done => {
        const renderMock = jest.fn();
        instance.render = renderMock;
        const addMock = jest.fn();
        const instanceRef = {};
        const nextStateRef = {};
        instance.queue.add = addMock;
        instance.renderFrame(instanceRef, nextStateRef);
        instance.renderFrame(instanceRef, nextStateRef);
        expect(renderMock).toHaveBeenCalledTimes(0);
        setTimeout(() => {
          expect(renderMock).toHaveBeenCalledTimes(1);
          expect(instance.renderTimeoutId).toBe(null);
          done();
        });
      });
    });
  });
});
