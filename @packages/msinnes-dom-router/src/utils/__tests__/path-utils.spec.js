import { createRouteRegex } from '../regex-utils';

import { getParams } from '../path-utils';

describe('getParams', () => {
  it('should be a function', () => {
    expect(getParams).toBeInstanceOf(Function);
  });

  it('should return an empty object if the regex finds 0 matches', () => {
    const params = getParams(createRouteRegex('/path'), '/path', '/param1/1/param2/2')
    expect(params).toBeDefined();
    expect(params).toBeInstanceOf(Object);
    expect(Object.keys(params).length).toEqual(0);
  });

  it('should return an empty object if no param is found', () => {
    const params = getParams(createRouteRegex('/param1/1/param2/2', false), '/param1/1/param2/2', '/param1/1/param2/2');
    expect(params).toBeDefined();
    expect(params).toBeInstanceOf(Object);
    expect(Object.keys(params).length).toEqual(0);
  });

  it('should resolve params if they are found', () => {
    const params = getParams(createRouteRegex('/param1/:param1/param2/:param2', false), '/param1/:param1/param2/:param2', '/param1/1/param2/2');
    expect(params).toBeDefined();
    expect(params).toBeInstanceOf(Object);
    expect(params).toMatchObject({
      param1: '1',
      param2: '2',
    });
  });
});