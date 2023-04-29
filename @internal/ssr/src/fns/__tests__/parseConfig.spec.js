import { parseConfig } from '../parseConfig';

describe('parseConfig', () => {
  it('should be a function', () => {
    expect(parseConfig).toBeInstanceOf(Function);
  });

  it('should return a default config', () => {
    expect(parseConfig()).toMatchObject({ dom: {}, time: {} });
  });

  it('should return a url configuration', () => {
    expect(parseConfig({ url: 'url' })).toMatchObject({ dom: { url: 'url' }, time: {} });
  });

  it('should return a temporal configuration', () => {
    expect(parseConfig({ runExpiredTimers: true })).toMatchObject({ dom: {}, time: { runExpiredTimers: true }});
  });
});
