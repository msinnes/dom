import { parseConfig } from '../parseConfig';

describe('parseConfig', () => {
  it('should be a function', () => {
    expect(parseConfig).toBeInstanceOf(Function);
  });

  it('should return a default config', () => {
    expect(parseConfig()).toMatchObject({ dom: {}, time: {}, fetch: {} });
  });

  it('should return a url configuration', () => {
    expect(parseConfig({ url: 'url' })).toMatchObject({ dom: { url: 'url' }, time: {} });
  });

  it('should return a temporal configuration', () => {
    expect(parseConfig({ digestExpiredTimers: true })).toMatchObject({ dom: {}, time: { digestExpiredTimers: true }});
  });

  it('should return a fetch configuration', () => {
    const fn = () => {};
    expect(parseConfig({ digestFetch: true })).toMatchObject({ dom: {}, time: {}, fetch: { digestFetch: true } });
    expect(parseConfig({ fetch: fn })).toMatchObject({ dom: {}, time: {}, fetch: { fetch: fn } });
    expect(parseConfig({ fetch: {} })).toMatchObject({ dom: {}, time: {}, fetch: {} });
  });
});
