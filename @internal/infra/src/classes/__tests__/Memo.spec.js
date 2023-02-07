import { BaseDependable } from '../base/BaseDependable';

import { Memo } from '../Memo';

describe('Memo', () => {
  it('should be a class', () => {
    expect(Memo).toBeAClass();
  });

  it('should extend BaseDependable', () => {
    expect(Memo).toExtend(BaseDependable);
  });

  describe('instance', () => {
    let instance;
    let fnMock;
    let fn;
    beforeEach(() => {
      fnMock = jest.fn().mockReturnValue('memo');
      fn = () => fnMock();
      instance = new Memo(fn, []);
    });

    it('should set the fn prop', () => {
      expect(instance.fn).toBe(fn);
    });

    describe('getValue', () => {
      let shouldExecuteMock;
      beforeEach(() => {
        shouldExecuteMock = jest.fn().mockReturnValue(true);
        instance.shouldExecute = shouldExecuteMock;
      });

      it('should be a function', () => {
        expect(instance.getValue).toBeInstanceOf(Function);
      });

      it('should execute instance.fn if shouldExecute returns true', () => {
        const nextDependencies = [];
        expect(instance.getValue(nextDependencies)).toEqual('memo');
        expect(shouldExecuteMock).toHaveBeenCalledTimes(1);
        expect(shouldExecuteMock).toHaveBeenCalledWith(nextDependencies);
        expect(fnMock).toHaveBeenCalledTimes(1);
        expect(instance.getValue(nextDependencies));
        expect(shouldExecuteMock).toHaveBeenCalledTimes(2);
        expect(fnMock).toHaveBeenCalledTimes(2);
        shouldExecuteMock.mockReturnValueOnce(false);
        instance.getValue(nextDependencies);
        expect(shouldExecuteMock).toHaveBeenCalledTimes(3);
        expect(fnMock).toHaveBeenCalledTimes(2);
      });
    });
  });
});
