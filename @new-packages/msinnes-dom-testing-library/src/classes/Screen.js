import { Queries } from './Queries';

class Screen {
  constructor(controller) {
    this.container = controller.scope.body.elem;
    const queries = new Queries(this.container);

    this.getByText = text => {
      const results = queries.byText(text);
      if (results.length > 1) throw new Error('getByText found more than one result');
      if (results.length === 0) throw new Error('getByText did not find any results');
      return results[0];
    };
    this.getAllByText = text => {
      const results = queries.byText(text);
      if (results.length === 0) throw new Error('getAllByText did not find any results');
      return results;
    };
    this.queryAllByText = text => queries.byText(text);
  }
}

export { Screen };