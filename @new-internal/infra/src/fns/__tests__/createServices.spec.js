import { createServices } from '../createServices';

describe('createServices', () => {
  let mockHookService;
  let svc;
  beforeEach(() => {
    mockHookService = {
      createEntity: jest.fn(),
      destroyInstance: jest.fn(),
      closeActiveInstance: jest.fn(),
      setActiveInstance: jest.fn(),
    };
    svc = createServices(mockHookService);
  });

  it('should be a function', () => {
    expect(createServices).toBeInstanceOf(Function);
  });

  describe('hookController', () => {
    describe('createInstanceHooks', () => {
      it('should be a function', () => {
        expect(svc.createInstanceHooks).toBeInstanceOf(Function);
      });

      it('should call hookController.createContext', () => {
        const ref = {};
        svc.createInstanceHooks(ref);
        expect(mockHookService.createEntity).toHaveBeenCalledTimes(1);
        expect(mockHookService.createEntity).toHaveBeenCalledWith(ref);
      });
    });

    describe('destroyInstanceHooks', () => {
      it('should be a function', () => {
        expect(svc.destroyInstanceHooks).toBeInstanceOf(Function);
      });

      it('should call hookController.destroyInstance', () => {
        const ref = {};
        svc.destroyInstanceHooks(ref);
        expect(mockHookService.destroyInstance).toHaveBeenCalledTimes(1);
        expect(mockHookService.destroyInstance).toHaveBeenCalledWith(ref);
      });
    });

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
});
