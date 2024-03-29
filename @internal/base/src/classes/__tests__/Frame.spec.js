import { Frame, FrameQueue } from '../Frame';

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

describe('FrameQueue', () => {
  it('should be a class', () => {
    expect(FrameQueue).toBeInstanceOf(Function);
  });

  describe('instance', () => {
    let instance;
    beforeEach(() => {
      instance = new FrameQueue();
    });

    it('should have a frames prop', () => {
      expect(instance.frames).toBeInstanceOf(Array);
    });

    it('should have a length prop that returns the length of the frames array', () => {
      expect(instance.length).toBe(0);
      instance.add({}, {});
      expect(instance.length).toBe(1);
    });

    describe('add', () => {
      it('should be a function', () => {
        expect(instance.add).toBeInstanceOf(Function);
      });

      it('should take an instance and state and append a frame to the end of the queue', () => {
        const instanceRef = {};
        const nextStateRef = {};
        instance.add(instanceRef, nextStateRef);
        expect(instance.frames.length).toEqual(1);
        expect(instance.frames[0]).toBeInstanceOf(Frame);
        expect(instance.frames[0].instance).toBe(instanceRef);
        expect(instance.frames[0].nextState).toBe(nextStateRef);
      });
    });

    describe('next', () => {
      it('should be a function', () => {
        expect(instance.next).toBeInstanceOf(Function);
      });

      it('should shift the first item from the list', () => {
        const instanceOne = {};
        const nextStateOne = {};
        const instanceTwo = {};
        const nextStateTwo = {};
        instance.add(instanceOne, nextStateOne);
        instance.add(instanceTwo, nextStateTwo);
        let next = instance.next();
        expect(next).toBeInstanceOf(Frame);
        expect(next.instance).toBe(instanceOne);
        expect(next.nextState).toBe(nextStateOne);
        next = instance.next();
        expect(next).toBeInstanceOf(Frame);
        expect(next.instance).toBe(instanceTwo);
        expect(next.nextState).toBe(nextStateTwo);
        expect(instance.frames.length).toEqual(0);
      });
    });
  });
});
