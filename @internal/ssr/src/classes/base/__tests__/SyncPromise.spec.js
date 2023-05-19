import { SyncPromise } from '../SyncPromise';

// Test assembled from original build, and finished from WebDevSimplified example for chaining algorithm
const DEFAULT_VALUE = 'default';

function promise({ value = DEFAULT_VALUE, fail = false} = {}) {
  return new SyncPromise((resolve, reject) => {
    fail ? reject(value) : resolve(value);
  });
}

describe('SyncPromise', () => {
  it('should be a class', () => {
    expect(SyncPromise).toBeAClass();
  });

  describe('static methods', () => {
    it('resolve', () => {
      return SyncPromise.resolve(DEFAULT_VALUE).then(v => expect(v).toEqual(DEFAULT_VALUE));
    });

    it("reject", () => {
      return SyncPromise.reject(DEFAULT_VALUE).catch(v =>
        expect(v).toEqual(DEFAULT_VALUE)
      );
    });

    describe("all", () => {
      it("with success", () => {
        return SyncPromise.all([promise({ value: 1 }), promise({ value: 2 })]).then(
          v => expect(v).toEqual([1, 2])
        );
      });

      it("with fail", () => {
        return SyncPromise.all([promise(), promise({ fail: true })]).catch(v =>
          expect(v).toEqual(DEFAULT_VALUE)
        );
      });
    });

    it("allSettled", () => {
      return SyncPromise.allSettled([promise(), promise({ fail: true })]).then(v =>
        expect(v).toEqual([
          { status: "fulfilled", value: DEFAULT_VALUE },
          { status: "rejected", reason: DEFAULT_VALUE },
        ])
      );
    });

    describe("race", () => {
      it("with success", () => {
        return SyncPromise.race([
          promise({ value: 1 }),
          promise({ value: 2 }),
        ]).then(v => expect(v).toEqual(1));
      });

      it("with fail", () => {
        return SyncPromise.race([
          promise({ fail: true, value: 1 }),
          promise({ fail: true, value: 2 }),
        ]).catch(v => expect(v).toEqual(1));
      });
    });

    describe("any", () => {
      it("with success", () => {
        return SyncPromise.any([promise({ value: 1 }), promise({ value: 2 })]).then(
          v => expect(v).toEqual(1)
        );
      });

      it("with fail", () => {
        return SyncPromise.any([
          promise({ fail: true, value: 1 }),
          promise({ value: 2 }),
        ]).catch(e => expect(e.errors).toEqual([1, 2]));
      });
    });
  });

  describe('instance', () => {
    let instance;

    let execute;
    let error;

    beforeEach(() => {
      instance = new SyncPromise((resolve, reject) => {
        execute = data => {
          resolve(data);
        };
        error = err => {
          reject(err);
        };
      });
    });

    describe('then', () => {
      it('should be a function', () => {
        expect(instance.then).toBeInstanceOf(Function);
      });

      it('should get called on resolve', () => {
        const mockFn = jest.fn();
        const mockData = {};
        instance.then(data => mockFn(data));
        expect(mockFn).not.toHaveBeenCalled();
        execute(mockData);
        expect(mockFn).toHaveBeenCalledTimes(1);
        expect(mockFn).toHaveBeenCalledWith(mockData);
      });

      it('should sequece through chained then handlers', () => {
        const mockFn = jest.fn();
        const mockData = { name: { text: 'name' } };
        instance.then(data => data.name).then(data => mockFn(data.text));
        expect(mockFn).not.toHaveBeenCalled();
        execute(mockData);
        expect(mockFn).toHaveBeenCalledTimes(1);
        expect(mockFn).toHaveBeenCalledWith('name');
      });

      it('should chain promises and pass resolved data', () => {
        const mockFn = jest.fn();
        const mockData = { name: { text: 'name' } };
        instance.then(data => SyncPromise.resolve(data.name)).then(data => mockFn(data.text));
        expect(mockFn).not.toHaveBeenCalled();
        execute(mockData);
        expect(mockFn).toHaveBeenCalledTimes(1);
        expect(mockFn).toHaveBeenCalledWith('name');
      });

      describe('WebDevSimplified Tests', () => {
        it('with no chaining', () => {
          return promise().then(v => expect(v).toEqual(DEFAULT_VALUE));
        });

        it('with multiple thens for same promise', () => {
          const checkFunc = v => expect(v).toEqual(DEFAULT_VALUE);
          const mainPromise = promise();
          const promise1 = mainPromise.then(checkFunc);
          const promise2 = mainPromise.then(checkFunc);
          return Promise.allSettled([promise1, promise2]);
        });

        it('with then and catch', () => {
          const checkFunc = v => expect(v).toEqual(DEFAULT_VALUE);
          const failFunc = () => expect(1).toEqual(2);
          const resolvePromise = promise().then(checkFunc, failFunc);
          const rejectPromise = promise({ fail: true }).then(failFunc, checkFunc);
          return Promise.allSettled([resolvePromise, rejectPromise]);
        });

        it('with chaining', () => {
          return promise({ value: 3 })
            .then(v => v * 4)
            .then(v => expect(v).toEqual(12));
        });
      });
    });

    describe('catch', () => {
      it('should be a function', () => {
        expect(instance.catch).toBeInstanceOf(Function);
      });

      it('should get called on reject', () => {
        const mockFn = jest.fn();
        const mockError = {};
        instance.catch(err => mockFn(err));
        expect(mockFn).not.toHaveBeenCalled();
        error(mockError);
        expect(mockFn).toHaveBeenCalledTimes(1);
        expect(mockFn).toHaveBeenCalledWith(mockError);
      });

      describe('WebDevSimplified Tests', () => {
        it('with no chaining', () => {
          return promise({ fail: true }).catch(v => expect(v).toEqual(DEFAULT_VALUE));
        });

        it('with multiple catches for same promise', () => {
          const checkFunc = v => expect(v).toEqual(DEFAULT_VALUE);
          const mainPromise = promise({ fail: true });
          const promise1 = mainPromise.catch(checkFunc);
          const promise2 = mainPromise.catch(checkFunc);
          return Promise.allSettled([promise1, promise2]);
        });

        it('with chaining', () => {
          return promise({ value: 3 })
            .then(v => {
              throw v * 4;
            })
            .catch(v => expect(v).toEqual(12));
        });
      });
    });

    describe('finally', () => {
      it('should be a function', () => {
        expect(instance.finally).toBeInstanceOf(Function);
      });

      it('should get called for resolve', () => {
        const mockFn = jest.fn();
        const mockData = {};
        instance.finally(data => mockFn(data));
        expect(mockFn).not.toHaveBeenCalled();
        execute(mockData);
        expect(mockFn).toHaveBeenCalledTimes(1);
      });

      it('should get called on reject', () => {
        const mockFn = jest.fn();
        const mockError = {};
        instance.finally((data, err) => mockFn(data, err));
        expect(mockFn).not.toHaveBeenCalled();
        error(mockError);
        expect(mockFn).toHaveBeenCalledTimes(1);
      });

      describe('WebDevSimplified Tests', () => {
        it('with no chaining', () => {
          const checkFunc = () => v => expect(v).toBeUndefined();
          const successPromise = promise().finally(checkFunc);
          const failPromise = promise({ fail: true }).finally(checkFunc);
          return Promise.allSettled([successPromise, failPromise]);
        });

        it('with multiple finallys for same promise', () => {
          const checkFunc = v => expect(v).toBeUndefined();
          const mainPromise = promise();
          const promise1 = mainPromise.finally(checkFunc);
          const promise2 = mainPromise.finally(checkFunc);
          return Promise.allSettled([promise1, promise2]);
        });

        it('with chaining', () => {
          const checkFunc = () => v => expect(v).toBeUndefined();
          const successPromise = promise()
            .then(v => v)
            .finally(checkFunc);
          const failPromise = promise({ fail: true })
            .then(v => v)
            .finally(checkFunc);
          return Promise.allSettled([successPromise, failPromise]);
        });
      });
    });
  });
});
