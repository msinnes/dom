import { BaseRender } from '../BaseRender';

import { EmptyRender } from '../EmptyRender';

describe('EmptyRender', () => {
  it('should be a class', () => {
    expect(EmptyRender).toBeAClass();
  });

  it('should extend BaseRender', () => {
    expect(EmptyRender).toExtend(BaseRender);
  });

  describe('instance', () => {
    let instance;
    beforeEach(() => {
      instance = new EmptyRender(null);
    });

    it('should set isEmptyRender to true', () => {
      expect(instance.isEmptyRender).toBe(true);
    });
  });
});
