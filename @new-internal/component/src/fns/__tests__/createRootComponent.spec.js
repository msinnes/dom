import { DomRef } from '@new-internal/dom';

import { createRootComponent } from '../createRootComponent';

describe('createRootComponent', () => {
  it('should be a function', () => {
    expect(createRootComponent).toBeInstanceOf(Function);
  });

  it('should create a root component instance', () => {
    const elemRef = {};
    const renderRef = {};

    const root = createRootComponent(renderRef, new DomRef(elemRef));

    expect(root.elem.elem).toBe(elemRef);
    expect(root.root).toBe(renderRef);
    expect(root.domContext).toBeUndefined();
  });

  it('should assign a dom context to the root component', () => {
    const domContextRef = {};

    const root = createRootComponent({}, {}, domContextRef);

    expect(root.domContext).toBe(domContextRef);
  });
});
