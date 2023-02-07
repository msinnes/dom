import { parseConfig } from '../parseConfig';

describe('parseConfig', () => {
  it('should be a function', () => {
    expect(parseConfig).toBeInstanceOf(Function);
  });

  it('should return a default config', () => {
    expect(parseConfig()).toMatchObject({ dom: {} });
  });

  it('should return a default config', () => {
    expect(parseConfig({ url: 'url' })).toMatchObject({ dom: { url: 'url' } });
  });
});
