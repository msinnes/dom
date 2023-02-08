import * as api from '..';

import { useLocation, useNavigate, useParams } from '../hooks';
import { Case, Redirect, Switch } from '../components/Switch';
import { Link } from '../components/Link';
import { Router } from '../components/Router';

describe('api', () => {
  it('should expose Router', () => {
    expect(api.Router).toBe(Router);
  });

  it('should expose a Switch, Case, and Redirect', () => {
    expect(api.Switch).toBe(Switch);
    expect(api.Case).toBe(Case);
    expect(api.Redirect).toBe(Redirect);
  });

  it('should expose a Link', () => {
    expect(api.Link).toBe(Link);
  });

  it('should expose hooks', () => {
    expect(api.useLocation).toBe(useLocation);
    expect(api.useNavigate).toBe(useNavigate);
    expect(api.useParams).toBe(useParams);
  });
});
