import { DomRef } from '../DomRef';
import { BaseDomNode } from '../BaseDomNode';

import { RootNode } from '../RootNode';

describe('RootNode', () => {
  it('should be a class', () => {
    expect(RootNode).toBeAClass();
  });

  it('should extend BaseDomNode', () => {
    expect(RootNode).toExtend(BaseDomNode);
  });

  describe('instance', () => {
    let ref;
    let instance;
    beforeEach(() => {
      ref = {};
      instance = new RootNode(ref);
    });

    it('should have a ref prop', () => {
      expect(instance.ref).toBeInstanceOf(DomRef);
      expect(instance.ref.elem).toBe(ref);
    });
  });
});