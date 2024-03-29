import { Infra } from '../Infra';

import { ContextService } from '../ctx/ContextService';
import { EffectService } from '../effect/EffectService';
import { HookService } from '../hooks/HookService';

jest.mock('../../fns/createServices', () => ({
  createServices: jest.fn(),
}));

jest.mock('../../fns/createHooks', () => ({
  createHooks: jest.fn(),
}));

describe('Infra', () => {
  it('should be a class', () => {
    expect(Infra).toBeAClass();
  });

  it('should expose the contextService statically', () => {
    expect(Infra.contextService).toBeInstanceOf(ContextService);
  });

  describe('instance', () => {
    let servicesRef;
    let hooksRef;
    let createServicesMock;
    let createHooksMock;

    let instance;
    beforeEach(() => {
      const { createServices } = require('../../fns/createServices');
      const { createHooks } = require('../../fns/createHooks');

      servicesRef = {};
      hooksRef = {};
      createServices.mockReturnValue(servicesRef);
      createHooks.mockReturnValue(hooksRef);

      createServicesMock = createServices;
      createHooksMock = createHooks;

      instance = new Infra();
    });

    it('should expose a context service', () => {
      expect(instance.contextService).toBeInstanceOf(ContextService);
    });

    it('should be the same contextService across multiple instances', () => {
      const localInstance = new Infra();
      expect(localInstance.contextService).toBe(instance.contextService);
    });

    it('should expose a effectService', () => {
      expect(instance.effectService).toBeInstanceOf(EffectService);
    });

    it('should expose a hookService', () => {
      expect(instance.hookService).toBeInstanceOf(HookService);
    });

    it('should expose services', () => {
      expect(instance.services).toBe(servicesRef);
      expect(createServicesMock).toHaveBeenCalledWith(instance.hookService, instance.effectService, instance.contextService);
    });

    it('should expose hooks', () => {
      expect(instance.hooks).toBe(hooksRef);
      expect(createHooksMock).toHaveBeenCalledWith(instance.hookService, instance.effectService, instance.contextService);
    });
  });
});
