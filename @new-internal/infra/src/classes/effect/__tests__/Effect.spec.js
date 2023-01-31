import { BaseDependable } from '../../base/BaseDependable';

import { Effect } from '../Effect';

describe('Effect', () => {
  it('should be a class', () => {
    expect(Effect).toBeAClass();
  });

  it('should extend BaseDependable', () => {
    expect(Effect).toExtend(BaseDependable);
  });

  describe('instance', () => {
    let instance;
    let mockEffectFn;
    let mockCleanupFn;
    let mockEmptyConditions;
    let shouldExecuteMock;
    beforeEach(() => {
      mockEffectFn = jest.fn();
      mockCleanupFn = jest.fn();
      mockEffectFn.mockImplementation(() => mockCleanupFn);
      mockEmptyConditions = [];
      instance = new Effect(mockEffectFn, mockEmptyConditions);
      shouldExecuteMock = jest.spyOn(instance, 'shouldExecute').mockReturnValue(false);
    });

    it('should have an fn prop equal to the passed function', () => {
      expect(instance.fn).toBe(mockEffectFn);
    });

    it('should have a cleanupFn prop defaulted to null', () => {
      expect(instance.cleanupFn).toBe(null);
    });

    it('should have nextDependencies set to an empty array', () => {
      expect(instance.nextDependencies).toBeInstanceOf(Array);
      expect(instance.nextDependencies.length).toEqual(0);
    });

    describe('cleanup', () => {
      it('should be a function', () => {
        expect(instance.cleanup).toBeInstanceOf(Function);
      });

      it('should not do anything if no cleanupFn is present', () => {
        shouldExecuteMock.mockReturnValue(true);
        mockEffectFn.mockImplementationOnce(() => undefined);
        instance.exec();
        instance.cleanup();
        expect(mockCleanupFn).not.toHaveBeenCalled();
        instance.exec();
        instance.cleanup();
        expect(mockCleanupFn).toHaveBeenCalledTimes(1);
      });

      it('should execute the stored cleanupFn', () => {
        shouldExecuteMock.mockReturnValue(true);
        instance.exec();
        instance.cleanup();
        expect(mockCleanupFn).toHaveBeenCalledTimes(1);

        const anotherMock = jest.fn();
        mockEffectFn.mockImplementationOnce(() => anotherMock);
        instance.exec();
        instance.cleanup();
        expect(anotherMock).toHaveBeenCalledTimes(1);
      });
    });

    describe('exec', () => {
      it('should be a function', () => {
        expect(instance.exec).toBeInstanceOf(Function);
      });

      it('should call shouldExecute with the input conditions', () => {
        instance.exec();
        expect(shouldExecuteMock).toHaveBeenCalledTimes(1);
        expect(shouldExecuteMock).toHaveBeenCalledWith(instance.nextDependencies);
      });

      it('should set the cleanupFn from fn if shouldExecute returns true', () => {
        shouldExecuteMock.mockReturnValue(true);
        instance.exec([]);
        expect(instance.cleanupFn).toBe(mockCleanupFn);
      });

      it('should set the value on nextDependencies to the dependencies prop', () => {
        const nextDependencies = [];
        const oldDependencies = instance.dependencies;
        instance.nextDependencies = nextDependencies;
        instance.exec();
        expect(instance.dependencies).not.toBe(oldDependencies);
        expect(instance.dependencies).toBe(nextDependencies);
      });
    });
  });
});
