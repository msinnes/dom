import { BaseRender } from '../BaseRender';

import { TextRender } from '../TextRender';

describe('TextRender', () => {
  it('should be a class', () => {
    expect(TextRender).toBeAClass();
  });

  it('should extend BaseRender', () => {
    expect(TextRender).toExtend(BaseRender);
  });

  describe('instance', () => {
    let instance;
    beforeEach(() => {
      instance = new TextRender('');
    });

    it('should set isTextRender to true', () => {
      expect(instance.isTextRender).toBe(true);
    });
  });
});