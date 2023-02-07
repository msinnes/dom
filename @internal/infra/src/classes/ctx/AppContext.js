import { BaseContext } from '@internal/base';
import { UserContext } from './UserContext';

class AppContext extends BaseContext {
  constructor(defaultValue) {
    super(defaultValue);

    this.userContext = new UserContext(this);
  }
}

export { AppContext };
