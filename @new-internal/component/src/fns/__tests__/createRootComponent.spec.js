import { createRootComponent } from '../createRootComponent';

describe('createRootComponent', () => {
  it('should be a function', () => {
    expect(createRootComponent).toBeInstanceOf(Function);
  });

  it('should create a root component instance', () => {
    const elemRef = {};
    const renderRef = {};

    const root = createRootComponent(renderRef, elemRef);

    expect(root.elem.elem).toBe(elemRef);
    expect(root.root).toBe(renderRef);
  });
});