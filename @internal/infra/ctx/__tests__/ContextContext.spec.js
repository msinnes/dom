import { Context } from '../Context';

import { ContextContext } from '../ContextContext';

describe('ContextContext', () => {
  it('should be a class', () => {
    expect(ContextContext).toBeAClass();
  });

  describe('instance', () => {
    let instance;
    beforeEach(() => {
      instance = new ContextContext('default value');
    });

    it('should expose a default value', () => {
      expect(instance.defaultValue).toEqual('default value');
    });

    it('should have an empty array on the values prop', () => {
      expect(instance.values).toBeInstanceOf(Array);
      expect(instance.values.length).toBe(0);
    });

    it('should have a context on the ctx prop', () => {
      expect(instance.ctx).toBeInstanceOf(Context);
    });

    describe('value', () => {
      it('should return the defaultValue if there are no values in the array', () => {
        expect(instance.value).toEqual('default value');
      });

      it('should return the 0 index if there are values in the array', () => {
        instance.values.unshift('value 1');
        instance.values.unshift('value 2');
        expect(instance.value).toEqual('value 2');
        instance.values.shift();
        expect(instance.value).toEqual('value 1');
      });
    });

    describe('addValue', () => {
      it('should be a function', () => {
        expect(instance.addValue).toBeInstanceOf(Function);
      });

      it('should unshift values to the beginning of the array', () => {
        instance.addValue('value 1');
        expect(instance.values.length).toEqual(1);
        expect(instance.values[0]).toEqual('value 1');
        instance.addValue('value 2');
        expect(instance.values.length).toEqual(2);
        expect(instance.values[0]).toEqual('value 2');
        expect(instance.values[1]).toEqual('value 1');
      });
    });

    describe('removeValue', () => {
      it('should be a function', () => {
        expect(instance.removeValue).toBeInstanceOf(Function);
      });

      it('should shift values from the beginning of the array', () => {
        instance.values = ['value 2', 'value 1'];
        instance.removeValue();
        expect(instance.values.length).toEqual(1);
        expect(instance.values[0]).toEqual('value 1');
      });
    });
  });
});