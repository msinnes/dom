const STATE = {
  FULFILLED: 'fulfilled',
  REJECTED: 'rejected',
  PENDING: 'pending',
};

class SyncPromise {
  static resolve(value) {
    return new SyncPromise(resolve => {
      resolve(value);
    });
  }

  static reject(value) {
    return new SyncPromise((resolve, reject) => {
      reject(value);
    });
  }

  static all(promises) {
    const results = [];
    let completedPromises = 0;
    return new SyncPromise((resolve, reject) => {
      for (let i = 0; i < promises.length; i++) {
        const promise = promises[i];
        promise.then(value => {
          completedPromises++;
          results[i] = value;
          if (completedPromises === promises.length) {
            resolve(results);
          }
        }).catch(reject);
      }
    });
  }

  static allSettled(promises) {
    const results = [];
    let completedPromises = 0;
    return new SyncPromise(resolve => {
      for (let i = 0; i < promises.length; i++) {
        const promise = promises[i];
        promise
          .then(value => {
            results[i] = { status: STATE.FULFILLED, value };
          })
          .catch(reason => {
            results[i] = { status: STATE.REJECTED, reason };
          })
          .finally(() => {
            completedPromises++;
            if (completedPromises === promises.length) {
              resolve(results);
            }
          });
      }
    });
  }

  static race(promises) {
    return new SyncPromise((resolve, reject) => {
      promises.forEach(promise => {
        promise.then(resolve).catch(reject);
      });
    });
  }

  static any(promises) {
    const errors = [];
    let rejectedPromises = 0;
    return new SyncPromise((resolve, reject) => {
      for (let i = 0; i < promises.length; i++) {
        const promise = promises[i];
        promise.then(resolve).catch(value => {
          rejectedPromises++;
          errors[i] = value;
          if (rejectedPromises === promises.length) {
            reject(new AggregateError(errors, "All promises were rejected"));
          }
        });
      }
    });
  }

  constructor(fn) {
    let thens = [];
    let catches = [];
    let state = STATE.PENDING;
    let value;

    const runCallbacks = () => {
      if (state === STATE.FULFILLED) {
        thens.forEach(t => {
          t(value);
        });

        thens = [];
      }

      if (state === STATE.REJECTED) {
        catches.forEach(c => {
          c(value);
        });

        catches = [];
      }
    };

    const onSuccess = val => {
      if (state !== STATE.PENDING) return;

      if (val instanceof SyncPromise) {
        val.then(onSuccess, onFail);
        return;
      }

      value = val;
      state = STATE.FULFILLED;
      runCallbacks();
    };

    const onFail = val => {
      if (state !== STATE.PENDING) return;

      if (val instanceof SyncPromise) {
        val.then(onSuccess, onFail);
        return;
      }

      value = val;
      state = STATE.REJECTED;
      runCallbacks();
    };

    try {
      fn(onSuccess, onFail);
    } catch (e) {
      onFail(e);
    }

    this.catch = catchFn => {
      return this.then(undefined, catchFn);
    };

    this.finally = finallyFn => {
      return this.then(
        result => {
          finallyFn();
          return result;
        },
        result => {
          finallyFn();
          throw result;
        }
      );
    };

    this.then = (thenFn, catchFn) => {
      return new SyncPromise((resolve, reject) => {
        thens.push(result => {
          // line disabled for continuity with adapted algorithm
          // eslint-disable-next-line eqeqeq
          if (thenFn == null) {
            resolve(result);
            return;
          }

          try {
            resolve(thenFn(result));
          } catch (e) {
            reject(e);
          }
        });

        catches.push(result => {
          // line disabled for continuity with adapted algorithm
          // eslint-disable-next-line eqeqeq
          if (catchFn == null) {
            reject(result);
            return;
          }

          try {
            resolve(catchFn(result));
          } catch (e) {
            reject(e);
          }
        });

        runCallbacks();
      });
    };
  }
}

export { SyncPromise };
