import { ParamsContext } from '../ParamsContext';

describe('ParamsContext', () => {
  it('should expose a Provider and Consumer', () => {
    expect(ParamsContext.Provider).toBeDefined();
    expect(ParamsContext.Consumer).toBeDefined();
  });
});