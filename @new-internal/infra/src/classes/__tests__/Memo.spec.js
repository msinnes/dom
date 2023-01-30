import { Memo } from '../Memo';

describe('Memo', () => {
  it('should be a class', () => {
    expect(Memo).toBeAClass();
  });

  describe('instance', () => {
    let instance;
    let fnMock;
    let fn;
    let dependencies;
    beforeEach(() => {
      fnMock = jest.fn().mockReturnValue('memo');
      fn = () => fnMock();
      dependencies = ['value'];
      instance = new Memo(fn, dependencies);
    });

    it('should have a tick prop set to 0', () => {
      expect(instance.tick).toEqual(0);
    });

    it('should set the fn prop', () => {
      expect(instance.fn).toBe(fn);
    });

    it('should set the dependencies prop', () => {
      expect(instance.dependencies).toBe(dependencies);
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

    describe('shouldExecute', () => {
      it('should be a function', () => {
        expect(instance.shouldExecute).toBeInstanceOf(Function);
      });

      it('should return true if tick is 0', () => {
        expect(instance.shouldExecute(['value'])).toEqual(true);
      });

      it('should increment instance.tick', () => {
        expect(instance.shouldExecute(['value'])).toEqual(true);
        expect(instance.tick).toEqual(1);
      });

      it('should update the dependency array', () => {
        const next = ['value'];
        expect(instance.shouldExecute(next)).toEqual(true);
        expect(instance.dependencies).toBe(next);
      });

      it('should return false if tick is greater than 0 and dependencies is empty', () => {
        instance.tick++;
        instance.dependencies = [];
        expect(instance.shouldExecute([])).toEqual(false);
      });

      it('should return false if tick is greater than 0 and no dependency has changed', () => {
        instance.tick++;
        expect(instance.shouldExecute(['value'])).toEqual(false);
      });

      it('should return true if tick is greater than 0 and a dependency has changed', () => {
        expect(instance.shouldExecute(['value'])).toEqual(true);
        expect(instance.shouldExecute(['new value'])).toEqual(true);
        expect(instance.shouldExecute(['new value'])).toEqual(false);
        expect(instance.shouldExecute(['another new value'])).toEqual(true);
      });

      it('should return true if tick is greater than 0 and the length of the dependency array changes', () => {
        expect(instance.shouldExecute(['value'])).toEqual(true);
        expect(instance.shouldExecute(['value', 'new value'])).toEqual(true);
        expect(instance.shouldExecute(['value', 'new value'])).toEqual(false);
        expect(instance.shouldExecute(['value', 'another new value'])).toEqual(true);
      });
    });
  });
});