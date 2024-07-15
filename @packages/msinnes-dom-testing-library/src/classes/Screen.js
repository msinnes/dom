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

// TODO: make a base class for this in @internal/ssr and extend it here
class Screen {
  constructor(scope) {
    let controller;
    scope.hook('bootstrap', cont => {
      controller = cont;
    });
    this.container = scope.container.elem;
    const queries = new Queries(this.container);

    this.createEvent = (type, config) => scope.createEvent(type, config);
    this.dispatchEvent = (elem, event, targetMutation) => {
      Object.assign(elem, targetMutation);
      elem.dispatchEvent(event);
    };

    Object.defineProperty(this, 'location', {
      get: () => scope.url,
    });

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
        scope.enable();
        const timer = scope.time.getNext();
        if (timer) controller.processHandler(timer);
        scope.disable();
      },
      play: (ticks = 1) => {
        if (ticks <= 0) return;
        let i = 0;
        let len = ticks;
        scope.enable();
        while(i < len) {
          scope.time.tick();
          controller.digest();
          i++;
        }
        scope.disable();
      },
      run: () => {
        scope.enable();
        const timers = scope.time.getAll();
        timers.forEach(timer => {
          controller.processHandler(timer);
        });
        scope.disable();
      },
      tick: (ticks = 1) => {
        if (ticks <= 0) return;
        let i = 0;
        let len = ticks;
        while(i < len) {
          scope.time.tick();
          i++;
        }
      },
    };

    this.fetch = {
      next: () => {
        scope.enable();
        const fetchHandler = scope.fetch.getNext();
        if (fetchHandler) controller.processHandler(fetchHandler);
        scope.disable();
      },
      run: () => {
        scope.enable();
        const fetchHandlers = scope.fetch.getAll();
        fetchHandlers.forEach(fetchHandler => {
          controller.processHandler(fetchHandler);
        });
        scope.disable();
      },
    };
  }
}

export { Screen };
