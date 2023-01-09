import { Renderer } from '../Renderer';
import { FrameQueue } from '../Frame';

import { BaseRenderController, BaseRenderableComponent } from '../BaseRenderController';

class TestableRenderController extends BaseRenderController {

}

describe('BaseRenderController', () => {
  it('should be a class', () => {
    expect(BaseRenderController).toBeAClass();
  });

  it('should be abstract', () => {
    expect(BaseRenderController).toBeAbstract();
  });

  describe('instance', () => {
    let instance;
    let renderRef;
    let anchorRef;

    beforeEach(() => {
      renderRef = {};
      anchorRef = {};
      instance = new TestableRenderController(BaseRenderableComponent, renderRef, anchorRef);
    });

    it('should have a renderer prop', () => {
      expect(instance.renderer).toBeInstanceOf(Renderer);
      expect(instance.renderer.root.root).toBe(renderRef);
      expect(instance.renderer.root.elem.elem).toBe(anchorRef);
    });

    it('should have a queue prop', () => {
      expect(instance.queue).toBeInstanceOf(FrameQueue);
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
    });

    describe('render', () => {
      it('should be a function', () => {
        expect(instance.render).toBeInstanceOf(Function);
      });

      it('should perform a root render on the app', () => {
        const renderMock = jest.fn();
        const componentRenderRef = {};
        const rootFirstChildRef = {};
        const rootRef = { firstChild: rootFirstChildRef, render: () => componentRenderRef };
        instance.renderer.root = rootRef;
        instance.renderer.render = renderMock;
        instance.render();
        expect(renderMock).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledWith(componentRenderRef, instance.renderer.root, rootFirstChildRef);
      });
    });

    describe('renderFrame', () => {
      it('should be a function', () => {
        expect(instance.renderFrame).toBeInstanceOf(Function);
      });

      it('should pull the next frame, call the frame write method, and then call renderAsync', () => {
        const nextMock = jest.fn();
        const writeMock = jest.fn();
        const frameMock = { write: writeMock };
        nextMock.mockImplementation(() => frameMock);
        instance.queue.next = nextMock;
        instance.renderFrame();
        expect(nextMock).toHaveBeenCalledTimes(1);
        expect(writeMock).toHaveBeenCalledTimes(1);
      });
    });
  });
});

describe('BaseRenderableComponent', () => {
  it('should be a class', () => {
    expect(BaseRenderableComponent).toBeAClass();
  });

  it('should be abstract', () => {
    expect(BaseRenderableComponent).toBeAbstract();
  });

  it('should have an abstract render method', () => {
    expect(BaseRenderableComponent).toHaveAbstractMethod('render');
  });
});
