import { storeContext } from '../storeContext';

describe('storeContext', () => {
  it('should be defined', () => {
    expect(storeContext).toBeDefined();
  });

  it('should have a provider', () => {
    expect(storeContext.Provider).toBeDefined();
  });
});
