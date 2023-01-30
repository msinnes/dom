import { Screen } from '../Screen';

describe('Screen', () => {
  it('should be a class', () => {
    expect(Screen).toBeAClass();
  });

  describe('instance', () => {
    let instance;
    let container;
    let ssrScope = {};
    let renderController;

    beforeEach(() => {
      container = {};
      ssrScope = { body: { elem: container } };
      renderController = { scope: ssrScope };
      instance = new Screen(renderController);
    });

    it('should set the container prop from the input controller', () => {
      expect(instance.container).toBe(container);
    });

    describe('getByText', () => {
      it('should be a function', () => {
        expect(instance.getByText).toBeInstanceOf(Function);
      });

      it('should return queried result', () => {
        container.children = [
          { textContent: 'not match' },
          { textContent: 'match' },
        ];
        const result = instance.getByText('match');
        expect(result).toBe(container.children[1]);
      });

      it('should throw an error if no results are found', () => {
        expect(() => {
          instance.getByText();
        }).toThrow('getByText did not find any results');
      });

      it('should throw an error if more than one result is found', () => {
        container.children = [
          { textContent: 'match' },
          { textContent: 'match' },
        ];
        expect(() => {
          instance.getByText('match');
        }).toThrow('getByText found more than one result');
      });
    });

    describe('getAllByText', () => {
      it('should be a function', () => {
        expect(instance.getAllByText).toBeInstanceOf(Function);
      });

      it('should return queried results', () => {
        container.children = [
          { textContent: 'not match' },
          { textContent: 'match' },
        ];
        const results = instance.getAllByText('match');
        expect(results.length).toEqual(1);
        expect(results[0]).toBe(container.children[1]);
      });

      it('should throw an error if no results are found', () => {
        expect(() => {
          instance.getAllByText();
        }).toThrow('getAllByText did not find any results');
      });
    });

    describe('queryAllByText', () => {
      it('should be a function', () => {
        expect(instance.queryAllByText).toBeInstanceOf(Function);
      });

      it('should return an array by default', () => {
        let results = instance.queryAllByText();
        expect(results).toBeInstanceOf(Array);
        expect(results.length).toEqual(0);
        results = instance.queryAllByText('');
        expect(results).toBeInstanceOf(Array);
        expect(results.length).toEqual(0);
      });

      it('should return a matching node', () => {
        container.children = [
          { textContent: 'not match', children: [{ textContent: 'match' }] },
          { textContent: 'match' },
        ];
        const results = instance.queryAllByText('match');
        expect(results.length).toEqual(2);
        expect(results[0]).toBe(container.children[0].children[0]);
        expect(results[1]).toBe(container.children[1]);
      });
    });
  });
});