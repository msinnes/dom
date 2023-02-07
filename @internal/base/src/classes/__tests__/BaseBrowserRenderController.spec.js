import { DomRef } from '@internal/dom';

import { BaseRenderController } from '../BaseRenderController';

import { BaseBrowserRenderController } from '../BaseBrowserRenderController';

class TestableRenderController extends BaseBrowserRenderController {
  bootstrap() {}
}

describe('BaseBrowserRenderController', () => {
  let timeouts;
  beforeEach(() => {
    timeouts = useMyTimers();
  });

  afterEach(() => {
    resetMyTimers();
  });

  it('should be a class', () => {
    expect(BaseBrowserRenderController).toBeAClass();
  });

  it('should extend BaseRenderController', () => {
    expect(BaseBrowserRenderController).toExtend(BaseRenderController);
  });

  it('should have an abstract bootstrap method', () => {
    expect(BaseBrowserRenderController).toHaveAbstractMethod('bootstrap');
  });

  describe('instance', () => {
    let anchorRef;
    let renderRef;

    let instance;
    let services;
    beforeEach(() => {
      anchorRef = {};
      renderRef = {};
      instance = new TestableRenderController(renderRef, new DomRef(anchorRef), {});
      services = {
        digestEffects: jest.fn(),
      };
      instance.services = services;
    });

    it('should have a renderTimeoutId property defaulted to null', () => {
      expect(instance.renderTimeoutId).toBeDefined();
      expect(instance.renderTimeoutId).toBe(null);
    });

    it('should have a trace prop', () => {
      expect(instance.trace).toEqual(0);
    });

    describe('processEffects', () => {
      it('should be a function', () => {
        expect(instance.processEffects).toBeInstanceOf(Function);
      });

      it('should call services.digestEffects', () => {
        instance.processEffects();
        expect(services.digestEffects).toHaveBeenCalledTimes(1);
      });

      it('should increment trace if there are items in the queue', () => {
        instance.queue.add({}, {});
        instance.processEffects();
        expect(services.digestEffects).toHaveBeenCalledTimes(1);
        expect(instance.trace).toEqual(1);
      });

      it('should set trace back to 0 if there are no items in the queue', () => {
        instance.trace = 1;
        instance.processEffects();
        expect(services.digestEffects).toHaveBeenCalledTimes(1);
        expect(instance.trace).toEqual(0);
      });

      it('should throw an error if trace if greater than 50', () => {
        instance.trace = 50;
        instance.queue.add({}, {});
        expect(() => instance.processEffects()).not.toThrow();
        expect(instance.trace).toEqual(51);
        expect(() => instance.processEffects()).toThrow('ImplementationError: Maximum call depth exceeded');
      });
    });

    describe('pushFrame', () => {
      it('should be a function', () => {
        expect(instance.pushFrame).toBeInstanceOf(Function);
      });

      it('should throw an error if the component tries to update state during the render cycle', () => {
        instance.renderer.renderingComponent = true;
        expect(() => {
          instance.pushFrame({}, {});
        }).toThrow('ImplementationError: setState cannot be called during the render cycle');
      });

      it('should push the frame to the frame queue', () => {
        const addMock = jest.fn();
        const instanceRef = {};
        const nextStateRef = {};
        instance.queue.add = addMock;
        instance.pushFrame(instanceRef, nextStateRef);
        expect(addMock).toHaveBeenCalledTimes(1);
        expect(addMock).toHaveBeenCalledWith(instanceRef, nextStateRef);
      });

      it('should call the render method after the stack has cleared', () => {
        const renderMock = jest.fn();
        instance.render = renderMock;
        const addMock = jest.fn();
        const instanceRef = {};
        const nextStateRef = {};
        instance.queue.add = addMock;
        instance.pushFrame(instanceRef, nextStateRef);
        expect(renderMock).toHaveBeenCalledTimes(0);
        timeouts.runAll();
        expect(renderMock).toHaveBeenCalledTimes(1);
      });

      it('should only call the render method once if multiple frames are pushed', () => {
        const renderMock = jest.fn();
        instance.render = renderMock;
        const addMock = jest.fn();
        const instanceRef = {};
        const nextStateRef = {};
        instance.queue.add = addMock;
        instance.pushFrame(instanceRef, nextStateRef);
        instance.pushFrame(instanceRef, nextStateRef);
        expect(renderMock).toHaveBeenCalledTimes(0);
        timeouts.runAll();
        expect(renderMock).toHaveBeenCalledTimes(1);
        expect(instance.renderTimeoutId).toBe(null);
      });
    });

    describe('render', () => {
      it('should be a function', () => {
        expect(instance.render).toBeInstanceOf(Function);
      });

      it('should call renderFrame if there are items in the queue', () => {
        const renderMock = jest.fn();
        const componentRenderRef = {};
        const rootFirstChildRef = {};
        const rootRef = { firstChild: rootFirstChildRef, render: () => componentRenderRef };
        instance.renderer.root = rootRef;
        instance.renderer.render = renderMock;

        const renderFrameMock = jest.fn();
        instance.renderFrame = renderFrameMock;
        instance.queue.add({}, {});
        instance.render();
        expect(renderFrameMock).toHaveBeenCalledTimes(1);
        expect(renderMock).not.toHaveBeenCalled();
      });

      it('should call super.render if there are no items in the queue', () => {
        const renderMock = jest.fn();
        const componentRenderRef = {};
        const rootFirstChildRef = {};
        const rootRef = { firstChild: rootFirstChildRef, render: () => componentRenderRef };
        instance.renderer.root = rootRef;
        instance.renderer.render = renderMock;

        const renderFrameMock = jest.fn();
        instance.renderFrame = renderFrameMock;
        instance.render();
        expect(renderFrameMock).not.toHaveBeenCalled();
        expect(renderMock).toHaveBeenCalledTimes(1);
        expect(services.digestEffects).toHaveBeenCalledTimes(1);
      });
    });

    describe('renderAsync', () => {
      it('should be a function', () => {
        expect(instance.renderAsync).toBeInstanceOf(Function);
      });

      it('should return the value from setTimeout', () => {
        expect(instance.renderAsync()).toEqual(1);
      });

      it('should call instance.render when the timer runs', () => {
        const renderMock = jest.fn();
        instance.render = renderMock;
        instance.renderAsync();
        timeouts.runAll();
        expect(renderMock).toHaveBeenCalledTimes(1);
      });

      it('should clear renderTimeoutId if true is passed as an argument', () => {
        instance.renderTimeoutId = 'not null';
        const renderMock = jest.fn();
        instance.render = renderMock;
        instance.renderAsync();
        timeouts.runAll();
        expect(renderMock).toHaveBeenCalledTimes(1);
        expect(instance.renderTimeoutId).toEqual('not null');
        instance.renderAsync(true);
        timeouts.runAll();
        expect(renderMock).toHaveBeenCalledTimes(2);
        expect(instance.renderTimeoutId).toEqual(null);
      });
    });

    describe('renderFrame', () => {
      it('should be a function', () => {
        expect(instance.renderFrame).toBeInstanceOf(Function);
      });

      it('should call super.renderFrame and then call renderAsync', () => {
        const nextMock = jest.fn();
        const writeMock = jest.fn();
        const renderAsyncMock = jest.fn();
        const frameMock = { write: writeMock };
        nextMock.mockImplementation(() => frameMock);
        instance.queue.next = nextMock;
        instance.renderAsync = renderAsyncMock;
        instance.renderFrame();
        expect(nextMock).toHaveBeenCalledTimes(1);
        expect(writeMock).toHaveBeenCalledTimes(1);
        expect(renderAsyncMock).toHaveBeenCalledTimes(1);
      });
    });
  });
});
