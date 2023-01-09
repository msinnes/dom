import * as api from '..';

describe('index', () => {
  it('should expose the api', () => {
    expect(api.createComponentFactory).toBeInstanceOf(Function);
    expect(api.createRootComponent).toBeInstanceOf(Function);
    expect(api.isDomComponent).toBeInstanceOf(Function);
  });
});