import { BaseDomNode } from '../BaseDomNode';

const elemRef = {};
const elemWrapper = { elem: elemRef };
class TestableBaseDomNode extends BaseDomNode {
  ref = elemWrapper;
}

describe('BaseDomNode', () => {
  it('should be a class', () => {
    expect(BaseDomNode).toBeAClass();
  });

  it('should be abstract', () => {
    expect(BaseDomNode).toBeAbstract();
  });

  describe('instance', () => {
    let instance;
    beforeEach(() => {
      instance = new TestableBaseDomNode();
    });

    it('should have an elem getter that returns ref.elem', () => {
      expect(instance.elem).toBe(instance.ref.elem);
    });
  });
});
