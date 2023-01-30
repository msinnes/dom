import * as api from '..';

import { BaseBrowserRenderController } from '../classes/BaseBrowserRenderController';
import { BaseServerRenderController } from '../classes/BaseServerRenderController';
import { BaseRenderableComponent } from '../classes/BaseRenderController';
import { Context } from '../classes/Context';

describe('api', () => {
  it('should expose the api', () => {
    expect(api.BaseContext).toBe(Context);
    expect(api.BaseBrowserRenderController).toBe(BaseBrowserRenderController);
    expect(api.BaseServerRenderController).toBe(BaseServerRenderController);
    expect(api.BaseRenderableComponent).toBe(BaseRenderableComponent);
  });
});