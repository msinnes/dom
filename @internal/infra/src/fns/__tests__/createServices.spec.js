import { createServices } from '../createServices';

describe('createServices', () => {
  let mockHookService;
  let mockEffectService;
  let mockContextService;
  let svc;
  beforeEach(() => {
    mockContextService = {
      clearContextValue: jest.fn(),
      getContextValue: jest.fn(),
      createEntity: jest.fn(),
    };
    mockHookService = {
      createEntity: jest.fn(),
      destroyInstance: jest.fn(),
      closeActiveInstance: jest.fn(),
      setActiveInstance: jest.fn(),
    };
    mockEffectService = {
      addClassEffect: jest.fn(),
      addEffect: jest.fn(),
      createEntity: jest.fn(),
      destroyInstance: jest.fn(),
      digest: jest.fn(),
    };
    svc = createServices(mockHookService, mockEffectService, mockContextService);
  });

  it('should be a function', () => {
    expect(createServices).toBeInstanceOf(Function);
  });

  describe('destroyInstance', () => {
    it('should be a function', () => {
      expect(svc.destroyInstance).toBeInstanceOf(Function);
    });

    it('should call the hook and effect mocks', () => {
      const instanceRef = {};
      svc.destroyInstance(instanceRef);
      expect(mockHookService.destroyInstance).toHaveBeenCalledTimes(1);
      expect(mockHookService.destroyInstance).toHaveBeenCalledWith(instanceRef);
      expect(mockEffectService.destroyInstance).toHaveBeenCalledTimes(1);
      expect(mockEffectService.destroyInstance).toHaveBeenCalledWith(instanceRef);
    });
  });

  describe('registerInstance', () => {
    it('should be a function', () => {
      expect(svc.registerInstance).toBeInstanceOf(Function);
    });

    it('should call the hook and effect mocks', () => {
      const instanceRef = {};
      svc.registerInstance(instanceRef);
      expect(mockHookService.createEntity).toHaveBeenCalledTimes(1);
      expect(mockHookService.createEntity).toHaveBeenCalledWith(instanceRef);
      expect(mockEffectService.createEntity).toHaveBeenCalledTimes(1);
      expect(mockEffectService.createEntity).toHaveBeenCalledWith(instanceRef);
    });
  });

  describe('hookController', () => {
    describe('closeActiveHookInstance', () => {
      it('should be a function', () => {
        expect(svc.closeActiveHookInstance).toBeInstanceOf(Function);
      });

      it('should call hookController.closeActiveInstance', () => {
        const ref = {};
        svc.closeActiveHookInstance(ref);
        expect(mockHookService.closeActiveInstance).toHaveBeenCalledTimes(1);
      });
    });

    describe('setActiveHookInstance', () => {
      it('should be a function', () => {
        expect(svc.setActiveHookInstance).toBeInstanceOf(Function);
      });

      it('should call hookController.setActiveInstance', () => {
        const ref = {};
        svc.setActiveHookInstance(ref);
        expect(mockHookService.setActiveInstance).toHaveBeenCalledTimes(1);
        expect(mockHookService.setActiveInstance).toHaveBeenCalledWith(ref);
      });
    });
  });

  describe('effectController', () => {
    describe('addClassEffect', () => {
      it('should be a function', () => {
        expect(svc.addClassEffect).toBeInstanceOf(Function);
      });

      it('should call effectController.addClassEffect', () => {
        const ref = {};
        svc.addClassEffect(ref);
        expect(mockEffectService.addClassEffect).toHaveBeenCalledTimes(1);
        expect(mockEffectService.addClassEffect).toHaveBeenCalledWith(ref);
      });
    });

    describe('addEffect', () => {
      it('should be a function', () => {
        expect(svc.addEffect).toBeInstanceOf(Function);
      });

      it('should call effectController.addEffect', () => {
        const ref = {};
        const effectRef = {};
        svc.addEffect(ref, effectRef);
        expect(mockEffectService.addEffect).toHaveBeenCalledTimes(1);
        expect(mockEffectService.addEffect).toHaveBeenCalledWith(ref, effectRef);
      });
    });

    describe('digestEffects', () => {
      it('should be a function', () => {
        expect(svc.digestEffects).toBeInstanceOf(Function);
      });

      it('should call effectController.digest', () => {
        const ref = {};
        svc.digestEffects(ref);
        expect(mockEffectService.digest).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('contextController', () => {
    describe('clearContextValue', () => {
      it('should be a function', () => {
        expect(svc.clearContextValue).toBeInstanceOf(Function);
      });

      it('should call contextController.clearContextValue', () => {
        const ref = {};
        svc.clearContextValue(ref);
        expect(mockContextService.clearContextValue).toHaveBeenCalledTimes(1);
        expect(mockContextService.clearContextValue).toHaveBeenCalledWith(ref, );
      });
    });

    describe('getContextValue', () => {
      it('should be a function', () => {
        expect(svc.getContextValue).toBeInstanceOf(Function);
      });

      it('should call contextController.getContextValue', () => {
        const ref = {};
        svc.getContextValue(ref);
        expect(mockContextService.getContextValue).toHaveBeenCalledTimes(1);
        expect(mockContextService.getContextValue).toHaveBeenCalledWith(ref);
      });
    });

    describe('createApiContext', () => {
      it('should be a function', () => {
        expect(svc.createApiContext).toBeInstanceOf(Function);
      });

      it('should call contextController.createContext', () => {
        const ref = {};
        svc.createApiContext(ref);
        expect(mockContextService.createEntity).toHaveBeenCalledTimes(1);
        expect(mockContextService.createEntity).toHaveBeenCalledWith(ref);
      });
    });
  });
});
