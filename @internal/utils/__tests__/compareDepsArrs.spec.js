import compareDepsArrs from '../compareDepsArrs';

describe('compareDepsArrs', () => {
  it('should be a function', () => {
    expect(compareDepsArrs).toBeInstanceOf(Function);
  });

  it('should return false if the nextConditions is an empty array', () => {
    expect(compareDepsArrs(undefined, [])).toBe(false);
  });

  it('should set shouldExecute to true if the passed array is a different length the the lastConditions array', () => {
    const mockNotEmptyArray = ['something'];
    expect(compareDepsArrs([], mockNotEmptyArray)).toBe(true);
  });

  it('should set shouldExecute to ture if the arrays are the same length and a condition has changed', () => {
    const mockNotEmptyArray = ['something'];
    const mockNotEmptyChangedArray = ['something else'];
    expect(compareDepsArrs(mockNotEmptyArray, mockNotEmptyChangedArray)).toBe(true);
  });

  it('should not throw an error if there is no lastConditons set', () => {
    expect(() => {
      compareDepsArrs(undefined, ['something']);
    }).not.toThrow();
  });

  it('should not throw an error if nextConditions is undefined', () => {
    expect(() => {
      compareDepsArrs([]);
    }).not.toThrow();
  });
});