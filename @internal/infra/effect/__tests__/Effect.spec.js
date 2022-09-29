import { Effect } from '../Effect';

describe('Effect', () => {
  it('should be a class', () => {
    expect(Effect).toBeAClass();
  });

  describe('instance', () => {
    let instance;
    let mockEffectFn;
    let mockCleanupFn;
    let mockEmptyConditions;
    beforeEach(() => {
      mockEffectFn = jest.fn();
      mockCleanupFn = jest.fn();
      mockEffectFn.mockImplementation(() => mockCleanupFn);
      mockEmptyConditions = [];
      instance = new Effect(mockEffectFn, mockEmptyConditions);
    });

    it('should have an fn prop equal to the passed function', () => {
      expect(instance.fn).toBe(mockEffectFn);
    });

    it('should have a cleanupFn prop defaulted to null', () => {
      expect(instance.cleanupFn).toBe(null);
    });

    it('should have a lastConditions prop equal to the passed array', () => {
      expect(instance.lastConditions).toBe(mockEmptyConditions);
      const localInstance = new Effect(() => {});
      expect(localInstance.lastConditions).toBeUndefined();
    });

    it('should have a shouldExecute prop defaulted to true', () => {
      expect(instance.shouldExecute).toBe(true);
    });

    it('should have a needsFirstExecution props defaulted to true', () => {
      expect(instance.needsFirstExecution).toBe(true);
    });

    describe('cleanup', () => {
      it('should be a function', () => {
        expect(instance.cleanup).toBeInstanceOf(Function);
      });

      it('should not to anything if no cleanupFn is present', () => {
        mockEffectFn.mockImplementationOnce(() => undefined);
        instance.exec();
        instance.cleanup();
        expect(mockCleanupFn).not.toHaveBeenCalled();
        instance.exec();
        instance.cleanup();
        expect(mockCleanupFn).toHaveBeenCalledTimes(1);
      });

      it('should execute the stored cleanupFn', () => {
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

      it('should execute the mockFn and set the cleanupFn prop if shouldExecute is true', () => {
        instance.exec();
        expect(mockEffectFn).toHaveBeenCalledTimes(1);
        expect(instance.cleanupFn).toBe(mockCleanupFn);

        const mockRef = {};
        mockEffectFn.mockImplementationOnce(() => mockRef);
        instance.exec();
        expect(mockEffectFn).toHaveBeenCalledTimes(2);
        expect(instance.cleanupFn).toBe(mockRef);
      });

      it('should not execute if shouldExecute is false', () => {
        instance.shouldExecute = false;
        instance.exec();
        expect(mockEffectFn).not.toHaveBeenCalled();
      });

      it('should set needsFirstExecution to false', () => {
        instance.exec();
        expect(instance.needsFirstExecution).toBe(false);
      });
    });

    describe('setShouldExecute', () => {
      it('should be a function', () => {
        expect(instance.setShouldExecute).toBeInstanceOf(Function);
      });

      it('should setShouldExecute to true if needsFirstExecution is true', () => {
        instance.setShouldExecute([]);
        expect(instance.shouldExecute).toBe(true);
      });

      it('should set shouldExecute to false if an empty array is passed, and update the lastConditions', () => {
        const localMockEmptyArray = [];
        instance.needsFirstExecution = false;
        instance.setShouldExecute(localMockEmptyArray);
        expect(instance.shouldExecute).toBe(false);
        expect(instance.lastConditions).toBe(localMockEmptyArray);
      });

      it('should set shouldExecute to true if the passed array is a different length the the lastConditions array', () => {
        const mockNotEmptyArray = ['something'];
        instance.needsFirstExecution = false;
        // switch the condition to false
        instance.shouldExecute = false;
        instance.setShouldExecute(mockNotEmptyArray);
        expect(instance.shouldExecute).toBe(true);
        expect(instance.lastConditions).toBe(mockNotEmptyArray);
      });

      it('should set shouldExecute to true if the arrays are the same length and a condition has changed', () => {
        instance.needsFirstExecution = false;
        const mockNotEmptyArray = ['something'];
        const mockNotEmptyChangedArray = ['something else'];
        instance.setShouldExecute(mockNotEmptyArray);
        expect(instance.shouldExecute).toBe(true);
        instance.setShouldExecute(mockNotEmptyArray);
        // switch the condition to false
        expect(instance.shouldExecute).toBe(false);
        instance.setShouldExecute(mockNotEmptyChangedArray);
        expect(instance.shouldExecute).toBe(true);
        expect(instance.lastConditions).toBe(mockNotEmptyChangedArray);
      });

      it('should not throw an error if there is no lastConditons set', () => {
        instance.needsFirstExecution = false;
        const localInstance = new Effect(() => {});
        let message;
        try {
          localInstance.setShouldExecute(['something']);
        } catch (e) {
          message = e.message;
        }
        expect(message).toBeUndefined();
      });

      it('should not throw an error if nextConditions is undefined', () => {
        instance.needsFirstExecution = false;
        let message;
        try {
          instance.setShouldExecute();
        } catch (e) {
          message = e.message;
        }
        expect(message).toBeUndefined();
      });
    });
  });
});