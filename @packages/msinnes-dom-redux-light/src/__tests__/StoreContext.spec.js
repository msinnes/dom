import { StoreContext } from '../StoreContext';

describe('StoreContext', () => {
  it('should be defined', () => {
    expect(StoreContext).toBeDefined();
  });

  it('should have a provider', () => {
    expect(StoreContext.Provider).toBeDefined();
  });
});
