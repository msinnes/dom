import { EmptyRender } from '../EmptyRender';
import { InternalBaseRender } from '../InternalBaseRender';

describe('EmptyRender', () => {
  it('should be a class', () => {
    expect(EmptyRender).toBeAClass();
  });

  it('should extend InternalBaseRender', () => {
    expect(EmptyRender).toExtend(InternalBaseRender);
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