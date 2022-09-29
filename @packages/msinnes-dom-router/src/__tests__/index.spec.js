import * as api from '..';

const { Router, Switch, Case, Redirect, Link } = api;

describe('index', () => {
  it('should expose Router', () => {
    expect(api.Router).toBeDefined();
  });

  it('should expose a Switch, Case, and Redirect', () => {
    expect(api.Switch).toBeDefined();
    expect(api.Case).toBeDefined();
    expect(api.Redirect).toBeDefined();
  });

  it('should expose a Link', () => {
    expect(api.Link).toBeDefined();
  });
});
