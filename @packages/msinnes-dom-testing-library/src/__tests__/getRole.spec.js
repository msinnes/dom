import { getRole } from '../getRole';

jest.mock('../TagToRoleMap', () => ({
  TagToRoleMap: {
    string: 'string',
    function: () => {},
  },
}));

describe('getRole', () => {
  it('should be a function', () => {
    expect(getRole).toBeInstanceOf(Function);
  });

  it('should return elem.role if the element has an assigned role', () => {
    expect(getRole({ role: 'role' })).toEqual('role');
  });

  it('should lookup the lowercase of an element tag and return the execution of a function if the entry is a function', () => {
    const { TagToRoleMap } = require('../TagToRoleMap');
    const fnMock = jest.fn();
    fnMock.mockReturnValue('function');
    TagToRoleMap.function = (...args) => fnMock(...args);
    const mockElem = { tagName: 'FUNCTION' };
    expect(getRole(mockElem)).toEqual('function');
    expect(fnMock).toHaveBeenCalledTimes(1);
    expect(fnMock).toHaveBeenCalledWith(mockElem);
  });

  it('should return whatever was found on tag to role map if it is not a function', () => {
    expect(getRole({ tagName: 'STRING' })).toEqual('string');
    expect(getRole({ tagName: 'NOTAVAILABLE' })).toBeUndefined();
  });
});