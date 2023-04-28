import { Queries } from './Queries';

function getBy(fnName, results) {
  if (results.length > 1) throw new Error(`${fnName} found more than one result`);
  if (results.length === 0) throw new Error(`${fnName} did not find any results`);
  return results[0];
}

function getAllBy(fnName, results) {
  if (results.length === 0) throw new Error(`${fnName} did not find any results`);
  return results;
}

class Screen {
  constructor(controller) {
    this.container = controller.scope.body.elem;
    const queries = new Queries(this.container);

    this.getByLabelText = text => {
      const results = queries.byLabelText(text);
      return getBy('getByLabelText', results);
    };
    this.getByRole = role => {
      const results = queries.byRole(role);
      return getBy('getByRole', results);
    };
    this.getByText = text => {
      const results = queries.byText(text);
      return getBy('getByText', results);
    };
    this.getAllByLabelText = text => {
      const results = queries.byLabelText(text);
      return getAllBy('getAllByLabelText', results);
    };
    this.getAllByRole = role => {
      const results = queries.byRole(role);
      return getAllBy('getAllByRole', results);
    };
    this.getAllByText = text => {
      const results = queries.byText(text);
      return getAllBy('getAllByText', results);
    };
    this.queryAllByLabelText = text => queries.byLabelText(text);
    this.queryAllByRole = role => queries.byRole(role);
    this.queryAllByText = text => queries.byText(text);

    this.time = {
      // There should be a next function which will only process a single timer and call digest
      // This is for super granular control over timer execution and rendering
      // This will execute the timer with the lowest remaining value, but the 0 floor on remaining needs to be removed.
      next: undefined,

      // Need to make sure this pattern works here.
      // If everything works as expected, this should leave any timers in the queue and just advance the time on them.
      // For this to work, the remaining prop needs to be able to run negative.
      // This way we can order timers based on which one should execute first.
      // The lower the remaining time, the earlier it should execute
      play: (ticks = 1) => {
        if (ticks <= 0) return;
        let i = 0;
        let len = ticks;
        while(i < len) {
          controller.scope.time.tick();
          controller.digest();
          i++;
        }
      },
      // This should only run the current timers and then digest the scope
      // This is how to run all timers if they don't process on digest (runExpiredTimers = false)
      // This should call digest to clear any other handlers configured to run
      // It will have to be call multiple times to digest subsequent timers if it is implemented correctly
      runCurrentTimers: undefined,
    };
  }
}

export { Screen };
