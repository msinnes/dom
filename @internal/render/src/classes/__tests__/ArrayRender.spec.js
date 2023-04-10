import { BaseRender } from '../BaseRender';

import { ArrayRender } from '../ArrayRender';

describe('ArrayRender', () => {
  it('should be a class', () => {
    expect(ArrayRender).toBeAClass();
  });

  it('should extend BaseRender', () => {
    expect(ArrayRender).toExtend(BaseRender);
  });

  describe('instance', () => {
    let instance;
    beforeEach(() => {
      instance = new ArrayRender([]);
    });

    it('should set isArrayRender to true', () => {
      expect(instance.isArrayRender).toBe(true);
    });
  });
});
