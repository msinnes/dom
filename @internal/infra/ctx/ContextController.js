import { BaseController } from '../base/BaseController';

import { ContextContext } from './ContextContext';

class ContextController extends BaseController {
  providers = [];

  createContext(defaultValue) {
    const ctxContext = new ContextContext(defaultValue);
    this.push(ctxContext.ctx, ctxContext);
    this.providers.push(ctxContext.ctx.Provider);
    return ctxContext.ctx;
  }

  getContextValue(ctx) {
    const context = this.lookup(ctx);
    if (!context) {
      console.warn('ImplementationWarning: The input context was not found, returning undefined.');
      return undefined;
    }
    return context.value;
  }

  clearContextValue(provider) {
    const idx = this.providers.indexOf(provider);
    (idx >= 0) && this.contexts[idx].removeValue();
  }
}

export { ContextController };
