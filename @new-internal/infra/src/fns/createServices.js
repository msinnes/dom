const createServices = hookService => ({
  createInstanceHooks: instance => hookService.createEntity(instance),
  destroyInstanceHooks: instance => hookService.destroyInstance(instance),
  closeActiveHookInstance: () => hookService.closeActiveInstance(),
  setActiveHookInstance: instance => hookService.setActiveInstance(instance),
});

export { createServices };
