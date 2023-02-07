import { BaseService } from '../base/BaseService';
import { AppContext } from './AppContext';

class ContextService extends BaseService {
  providers = [];

  createEntity(defaultValue) {
    const userContext = new AppContext(defaultValue);
    this.push(userContext.userContext, userContext);
    this.providers.push(userContext.userContext.Provider);
    return userContext.userContext;
  }

  getContextValue(userContext) {
    const appContext = this.lookup(userContext);
    if (!appContext) {
      console.warn('ImplementationWarning: The input context was not found, returning undefined.');
      return undefined;
    }
    return appContext.value;
  }

  clearContextValue(provider) {
    const idx = this.providers.indexOf(provider);
    if (idx >= 0) this.entities[idx].removeValue();
  }
}

export { ContextService };
