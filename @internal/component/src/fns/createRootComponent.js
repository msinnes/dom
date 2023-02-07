import { RootComponent } from '../classes/RootComponent';

const createRootComponent = (root, elem, domContext) => {
  const rootComponent = new RootComponent(root, elem);
  rootComponent.domContext = domContext;
  return rootComponent;
};

export { createRootComponent };
