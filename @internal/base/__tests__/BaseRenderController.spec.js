/**
 * @jest-environment jsdom
 */
import { BaseRenderController } from '../BaseRenderController';

import { FrameQueue } from '@internal/frame/FrameQueue';

class TestableRenderController extends BaseRenderController {
  render() {}
}

class NewTestableRenderController extends BaseRenderController {
  render() {}
}

describe('BaseRenderController', () => {
  it('should be a class', () => {
    expect(BaseRenderController).toBeAClass();;
  });

  it('should have an abstract render method', () => {
    class FailTestComponent extends BaseRenderController {}
    expect(FailTestComponent).toHaveAbstractMethod('render');
  });

  describe('instance', () => {
    let appRendererRef;
    let domRendererRef;
    let instance;
    beforeEach(() => {
      appRendererRef = { root: {}, renderingComponent: false };
      domRendererRef = { root: {} };
      instance = new NewTestableRenderController(domRendererRef, appRendererRef);
    });

    afterEach(jest.resetAllMocks);

    it('should have a queue prop', () => {
      expect(instance.queue).toBeInstanceOf(FrameQueue);
    });

    it('should have a domRenderer prop', () => {
      expect(instance.domRenderer).toBeDefined();
      expect(instance.domRenderer).toBe(domRendererRef);
    });

    it('should have an appRenderer prop', () => {
      expect(instance.appRenderer).toBeDefined();
      expect(instance.appRenderer).toBe(appRendererRef);
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
        instance.appRenderer.root.firstChild = rootFirstChildRef;
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
        const frameMock = { write: writeMock };
        nextMock.mockImplementation(() => frameMock);
        instance.queue.next = nextMock;
        instance.renderAppFrame();
        expect(nextMock).toHaveBeenCalledTimes(1);
        expect(writeMock).toHaveBeenCalledTimes(1);
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
        instance.domRenderer.root.firstChild = firstChildRef;
        instance.renderDom();
        expect(resolveMock).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledWith(domRenderRef, instance.domRenderer.root, firstChildRef);
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
    });
  });
});
