import { DomRef } from '@internal/dom';
import { BaseRenderController } from '../BaseRenderController';

import { BaseServerRenderController } from '../BaseServerRenderController';

class TestableRenderController extends BaseServerRenderController {}

describe('BaseServerRenderController', () => {
  it('should be a class', () => {
    expect(BaseServerRenderController).toBeAClass();
  });

  it('should extend BaseRenderController', () => {
    expect(BaseServerRenderController).toExtend(BaseRenderController);
  });

  describe('instance', () => {
    let instance;

    let renderRef;
    let bodyRef;
    let servicesRef;
    let ssrScopeRef;
    beforeEach(() => {
      renderRef = {};
      bodyRef = {};
      servicesRef = {
        digestEffects: jest.fn(),
      };
      ssrScopeRef = {
        body: new DomRef(bodyRef),
        close: jest.fn(),
        digest: jest.fn(),
        enable: jest.fn(),
        disable: jest.fn(),
        services: servicesRef,
        hook: jest.fn(),
      };
      instance = new TestableRenderController(renderRef, ssrScopeRef);
    });

    it('should have a scope prop set to the input ssrScop', () => {
      expect(instance.scope).toBe(ssrScopeRef);
    });

    it('should pass the ssrScope.services to the super constructor', () => {
      expect(instance.services.digestEffects).toBe(servicesRef.digestEffects);
    });

    it('should have a renderer prop with the correct render and anchor', () => {
      expect(instance.renderer.root.root).toBe(renderRef);
      expect(instance.renderer.root.elem.elem).toBe(bodyRef);
    });

    it('should have a hooks prop', () => {
      expect(instance.hooks).toBeInstanceOf(Object);
      expect(Object.keys(instance.hooks).length).toEqual(0);
    });

    it('should be hooked into the scope', () => {
      const instanceHook = ssrScopeRef.hook.mock.calls[0][1];

      const renderMock = jest.spyOn(instance, 'render').mockImplementation(() => {});
      const triggerMock = jest.spyOn(instance, 'trigger').mockImplementation(() => {});

      instanceHook();

      expect(renderMock).toHaveBeenCalledTimes(1);
      expect(triggerMock).toHaveBeenCalledTimes(1);
    });

    describe('close', () => {
      it('should be a function', () => {
        expect(instance.close).toBeInstanceOf(Function);
      });

      it('should call ssrScope.close', () => {
        instance.close();
        expect(ssrScopeRef.close).toHaveBeenCalledTimes(1);
      });
    });

    describe('digest', () => {
      let digestEffectsMock;
      let rootRenderMock;

      beforeEach(() => {
        digestEffectsMock = instance.scope.services.digestEffects;
        rootRenderMock = jest.spyOn(instance.renderer, 'rootRender').mockImplementation(() => {});
        ssrScopeRef.digest.mockReturnValue([]);
      });

      it('should be a function', () => {
        expect(instance.digest).toBeInstanceOf(Function);
      });

      it('should call ssrScope.digest', () => {
        instance.digest();
        expect(ssrScopeRef.digest).toHaveBeenCalledTimes(1);
      });

      it('should process frames and rerender if there are frames after digesting the scope', () => {
        instance.queue = [];
        const renderFrameMock = jest.spyOn(instance, 'renderFrame').mockImplementation(() => {
          instance.queue.pop();
        });
        ssrScopeRef.digest.mockReturnValueOnce([{
          exec:() => {
            instance.queue.push({});
          }
        }]);
        instance.digest();
        expect(rootRenderMock).toHaveBeenCalledTimes(1);
        expect(renderFrameMock).toHaveBeenCalledTimes(1);
        expect(digestEffectsMock).toHaveBeenCalledTimes(1);
        expect(ssrScopeRef.digest).toHaveBeenCalledTimes(2);
      });

      it('should throw an error if an infinite loop runs in the effect module', () => {
        instance.queue = [];
        const renderFrameMock = jest.spyOn(instance, 'renderFrame').mockImplementation(() => {
          instance.queue.pop();
        });
        ssrScopeRef.digest.mockReturnValueOnce([{
          exec:() => {
            instance.queue.push({});
          }
        }]);
        digestEffectsMock.mockImplementation(() => {
          instance.queue.push({});
        });
        expect(() => instance.digest()).toThrow('ImplementationError: Maximum call depth exceeded for DOM Effects.');
        expect(rootRenderMock).toHaveBeenCalledTimes(51);
        expect(renderFrameMock).toHaveBeenCalledTimes(51);
        expect(digestEffectsMock).toHaveBeenCalledTimes(50);
      });

      it('should throw an error if an infinite loop runs in the async module', () => {
        instance.queue = [];
        const renderFrameMock = jest.spyOn(instance, 'renderFrame').mockImplementation(() => {
          instance.queue.pop();
        });
        ssrScopeRef.digest.mockReturnValue([{
          exec:() => {
            instance.queue.push({});
          }
        }]);
        expect(() => instance.digest()).toThrow('ImplementationError: Maximum call depth exceeded for Asynchronous Processing.');
        expect(rootRenderMock).toHaveBeenCalledTimes(50);
        expect(renderFrameMock).toHaveBeenCalledTimes(50);
        expect(digestEffectsMock).toHaveBeenCalledTimes(50);
      });
    });

    describe('hook', () => {
      it('should be a function', () => {
        expect(instance.hook).toBeInstanceOf(Function);
      });

      it('should add a function to the array of hooks', () => {
        const mockFn = jest.fn();
        instance.hook('key', mockFn);
        expect(instance.hooks['key'].length).toEqual(1);
        expect(instance.hooks['key'][0]).toBe(mockFn);
      });
    });

    describe('processEffects', () => {
      let digestEffectsMock;
      let rootRenderMock;

      beforeEach(() => {
        digestEffectsMock = instance.scope.services.digestEffects;
        rootRenderMock = jest.spyOn(instance.renderer, 'rootRender').mockImplementation(() => {});
      });

      it('should be a function', () => {
        expect(instance.processEffects).toBeInstanceOf(Function);
      });

      it('should process any effects within the instance scope', () => {
        instance.processEffects();
        expect(digestEffectsMock).toHaveBeenCalledTimes(1);
      });

      it('should process frames and rerender if there are frames after processing the effects', () => {
        instance.queue = [];
        const renderFrameMock = jest.spyOn(instance, 'renderFrame').mockImplementation(() => {
          instance.queue.pop();
        });
        digestEffectsMock.mockImplementationOnce(() => {
          instance.queue.push({});
        });
        instance.processEffects();
        expect(rootRenderMock).toHaveBeenCalledTimes(1);
        expect(renderFrameMock).toHaveBeenCalledTimes(1);
        expect(digestEffectsMock).toHaveBeenCalledTimes(2);
      });

      it('should throw an error if an infinite loop runs', () => {
        instance.queue = [];
        const renderFrameMock = jest.spyOn(instance, 'renderFrame').mockImplementation(() => {
          instance.queue.pop();
        });
        digestEffectsMock.mockImplementation(() => {
          instance.queue.push({});
        });
        expect(() => instance.processEffects()).toThrow('ImplementationError: Maximum call depth exceeded for DOM Effects.');
        expect(rootRenderMock).toHaveBeenCalledTimes(50);
        expect(renderFrameMock).toHaveBeenCalledTimes(50);
      });
    });

    describe('processHandler', () => {
      let digestEffectsMock;
      let rootRenderMock;

      beforeEach(() => {
        digestEffectsMock = instance.scope.services.digestEffects;
        rootRenderMock = jest.spyOn(instance.renderer, 'rootRender').mockImplementation(() => {});
        ssrScopeRef.digest.mockReturnValue([]);
      });

      it('should be a function', () => {
        expect(instance.processHandler).toBeInstanceOf(Function);
      });

      it('should process frames and rerender if there are frames after executing the handler', () => {
        instance.queue = [];
        const renderFrameMock = jest.spyOn(instance, 'renderFrame').mockImplementation(() => {
          instance.queue.pop();
        });
        instance.processHandler({
          exec:() => {
            instance.queue.push({});
          }
        });
        expect(rootRenderMock).toHaveBeenCalledTimes(1);
        expect(renderFrameMock).toHaveBeenCalledTimes(1);
        expect(digestEffectsMock).toHaveBeenCalledTimes(1);
      });
    });

    describe('render', () => {
      let processEffectsMock;
      let digestMock;

      beforeEach(() => {
        processEffectsMock = jest.spyOn(instance, 'processEffects').mockImplementation(() => {});
        digestMock = jest.spyOn(instance, 'digest').mockImplementation(() => {});
      });

      it('should be a function', () => {
        expect(instance.render).toBeInstanceOf(Function);
      });

      it('should call scope.enable, super.render, instance.processEffects, instance.digest, and scope.disable', () => {
        const renderMock = jest.fn();
        const componentRenderRef = {};
        const rootFirstChildRef = {};
        const rootRef = { firstChild: rootFirstChildRef, render: () => componentRenderRef };
        instance.renderer.root = rootRef;
        instance.renderer.render = renderMock;
        instance.render();
        expect(ssrScopeRef.enable).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledTimes(1);
        expect(renderMock).toHaveBeenCalledWith(componentRenderRef, instance.renderer.root, rootFirstChildRef);
        expect(processEffectsMock).toHaveBeenCalledTimes(1);
        expect(processEffectsMock).toHaveBeenCalledWith();
        expect(digestMock).toHaveBeenCalledTimes(1);
        expect(digestMock).toHaveBeenCalledWith();
        expect(ssrScopeRef.disable).toHaveBeenCalledTimes(1);
      });
    });

    describe('trigger', () => {
      it('should be a function', () => {
        expect(instance.trigger).toBeInstanceOf(Function);
      });

      it('should fire all hooks', () => {
        const mockFn = jest.fn();
        instance.hook('key', mockFn);
        instance.hook('key', mockFn);
        instance.trigger('key');
        expect(mockFn).toHaveBeenCalledTimes(2);
      });
    });
  });
});
