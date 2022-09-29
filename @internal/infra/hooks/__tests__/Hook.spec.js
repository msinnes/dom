import { Hook } from '../Hook';

describe('Hook', () => {
  it('should be a class', () => {
    expect(Hook).toBeAClass();
  });

  describe('instance', () => {
    let instance;
    let componentInstanceRef;
    beforeEach(() => {
      componentInstanceRef = {};
      instance = new Hook(undefined, componentInstanceRef);
    });

    it('should set in initial value in the constructor', () => {
      const localInstance = new Hook('initialValue');
      expect(localInstance.get()).toEqual('initialValue');
    });

    it('should expose the component', () => {
      expect(instance.component).toBe(componentInstanceRef);
    });

    describe('set', () => {
      it('should be a function', () => {
        expect(instance.set).toBeInstanceOf(Function);
      });
    });

    describe('get', () => {
      it('should be a function', () => {
        expect(instance.get).toBeInstanceOf(Function);
      });

      it('should return the data set by the set function', () => {
        expect(instance.get()).toBeUndefined();
        instance.set('newValue');
        expect(instance.get()).toEqual('newValue');
      });
    });
  });
});