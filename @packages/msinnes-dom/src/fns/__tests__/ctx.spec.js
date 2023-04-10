import { infra } from '../../infra';

import { createContext } from '../ctx';

describe('createContext', () => {
  it('should be a function', () => {
    expect(createContext).toBeInstanceOf(Function);
  });

  it('should call the createApiContext mock', () => {
    const contextRef = {};
    const createApiContextMock = jest.spyOn(infra.services, 'createApiContext').mockReturnValue(contextRef);
    const ctx = createContext('defaultValue');
    expect(ctx).toBe(contextRef);
    expect(createApiContextMock).toHaveBeenCalledTimes(1);
    expect(createApiContextMock).toHaveBeenCalledWith('defaultValue');
  });
});
