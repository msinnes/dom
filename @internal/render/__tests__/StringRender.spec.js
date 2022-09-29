import { StringRender } from '../StringRender';
import { InternalBaseRender } from '../InternalBaseRender';

describe('StringRender', () => {
  it('should be a class', () => {
    expect(StringRender).toBeAClass();
  });

  it('should extend InternalBaseRender', () => {
    expect(StringRender).toExtend(InternalBaseRender);
  });

  describe('instance', () => {
    let instance;
    beforeEach(() => {
      instance = new StringRender('');
    });

    it('should set isStringRender to true', () => {
      expect(instance.isStringRender).toBe(true);
    });
  });
});