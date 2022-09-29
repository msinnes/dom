import { ArrayRender } from '../ArrayRender';
import { InternalBaseRender } from '../InternalBaseRender';

describe('ArrayRender', () => {
  it('should be a class', () => {
    expect(ArrayRender).toBeAClass();
  });

  it('should extend InternalBaseRender', () => {
    expect(ArrayRender).toExtend(InternalBaseRender);
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