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

    this.createEvent = (type, config) => controller.scope.createEvent(type, config);
    this.dispatchEvent = (elem, event, targetMutation) => {
      Object.assign(elem, targetMutation);
      elem.dispatchEvent(event);
    };
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
      next: () => {
        controller.scope.enable();
        const timer = controller.scope.time.getNext();
        if (timer) controller.processHandler(timer);
        controller.scope.disable();
      },
      play: (ticks = 1) => {
        if (ticks <= 0) return;
        let i = 0;
        let len = ticks;
        controller.scope.enable();
        while(i < len) {
          controller.scope.time.tick();
          controller.digest();
          i++;
        }
        controller.scope.disable();
      },
      run: () => {
        controller.scope.enable();
        const timers = controller.scope.time.getAll();
        timers.forEach(timer => {
          controller.processHandler(timer);
        });
        controller.scope.disable();
      },
      tick: (ticks = 1) => {
        if (ticks <= 0) return;
        let i = 0;
        let len = ticks;
        while(i < len) {
          controller.scope.time.tick();
          i++;
        }
      },
    };

    this.fetch = {
      next: () => {
        controller.scope.enable();
        const fetchHandler = controller.scope.fetch.getNext();
        if (fetchHandler) controller.processHandler(fetchHandler);
        controller.scope.disable();
      },
      run: () => {
        controller.scope.enable();
        const fetchHandlers = controller.scope.fetch.getAll();
        fetchHandlers.forEach(fetchHandler => {
          controller.processHandler(fetchHandler);
        });
        controller.scope.disable();
      },
    };
  }
}

export { Screen };
