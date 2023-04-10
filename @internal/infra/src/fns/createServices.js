const createServices = (hookService, effectService, contextService) => ({
  closeActiveHookInstance: () => hookService.closeActiveInstance(),
  setActiveHookInstance: instance => hookService.setActiveInstance(instance),

  addClassEffect: fn => effectService.addClassEffect(fn),
  addEffect: (instance, effect) => effectService.addEffect(instance, effect),
  digestEffects: () => effectService.digest(),

  clearContextValue: signature => contextService.clearContextValue(signature),
  getContextValue: ctx => contextService.getContextValue(ctx),
  createApiContext: defaultValue => contextService.createEntity(defaultValue),

  destroyInstance: instance => {
    hookService.destroyInstance(instance);
    effectService.destroyInstance(instance);
  },
  registerInstance: instance => {
    hookService.createEntity(instance);
    effectService.createEntity(instance);
  },
});

export { createServices };
