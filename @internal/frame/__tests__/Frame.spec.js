import { Frame } from '../Frame';

describe('Frame', () =>  {
  it('should be a class', () => {
    expect(Frame).toBeAClass();
  });

  describe('instance', () => {
    let instance;
    let frameInstanceRef;
    let frameNextStateRef;
    let writeStateMock;
    beforeEach(() => {
      frameInstanceRef = {};
      frameNextStateRef = {};
      writeStateMock = jest.fn();
      instance = new Frame({ instance: frameInstanceRef, writeState: writeStateMock }, frameNextStateRef);
    });

    it('should have an instance prop', () => {
      expect(instance.instance.instance).toBe(frameInstanceRef);
    });

    it('should have a nextState prop', () => {
      expect(instance.nextState).toBe(frameNextStateRef);
    });

    describe('write', () => {
      it('should be a function', () => {
        expect(instance.write).toBeInstanceOf(Function);
      });

      it('should execute instance.writeState with nextState', () => {
        instance.write();
        expect(writeStateMock).toHaveBeenCalledTimes(1);
        expect(writeStateMock).toHaveBeenCalledWith(frameNextStateRef);
      });
    });
  });
});