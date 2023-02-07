import { Context } from '../Context';

describe('Context', () => {
  it('should be a class', () => {
    expect(Context).toBeAClass();
  });

  describe('instance', () => {
    let instance;

    beforeEach(() => {
      instance = new Context();
    });

    it('should have an empty array on the values prop', () => {
      expect(instance.values).toBeInstanceOf(Array);
      expect(instance.values.length).toBe(0);
    });

    describe('addValue', () => {
      it('should be a function', () => {
        expect(instance.addValue).toBeInstanceOf(Function);
      });

      it('should push values to the end of the array', () => {
        instance.addValue('value 1');
        expect(instance.values.length).toEqual(1);
        expect(instance.values[0]).toEqual('value 1');
        instance.addValue('value 2');
        expect(instance.values.length).toEqual(2);
        expect(instance.values[0]).toEqual('value 1');
        expect(instance.values[1]).toEqual('value 2');
      });
    });

    describe('removeValue', () => {
      it('should be a function', () => {
        expect(instance.removeValue).toBeInstanceOf(Function);
      });

      it('should pop values from the end of the array', () => {
        instance.values = ['value 1', 'value 2'];
        instance.removeValue();
        expect(instance.values.length).toEqual(1);
        expect(instance.values[0]).toEqual('value 1');
      });
    });

    describe('value', () => {
      it('should return the defaultValue if there are no values in the array', () => {
        expect(instance.value).toBeUndefined();
        instance = new Context('default value');
        expect(instance.value).toEqual('default value');
      });

      it('should return the last index if there are values in the array', () => {
        instance.values = ['value 1', 'value 2'];
        expect(instance.value).toEqual('value 2');
        instance.removeValue();
        expect(instance.value).toEqual('value 1');
      });
    });
  });
});
