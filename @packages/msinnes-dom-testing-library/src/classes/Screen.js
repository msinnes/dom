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
  }
}

export { Screen };
