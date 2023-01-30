import { Queries } from '../Queries';

describe('Queries', () => {
  it('should be a class', () => {
    expect(Queries).toBeAClass();
  });

  describe('instance', () => {
    let instance;
    let container;

    beforeEach(() => {
      container = {};
      instance = new Queries(container);
    });

    it('should set the container prop', () => {
      expect(instance.container).toBe(container);
    });

    describe('byText', () => {
      it('should be a function', () => {
        expect(instance.byText).toBeInstanceOf(Function);
      });

      it('should call the query mock with a selector', () => {
        const queryMock = jest.spyOn(instance, 'query').mockImplementation(() => {});
        instance.byText('text');
        expect(queryMock).toHaveBeenCalledTimes(1);
        const selector = queryMock.mock.calls[0][0];
        expect(selector).toBeInstanceOf(Function);
      });

      it('should return an empty array for undefined or empty string inputs', () => {
        let results = instance.byText();
        expect(results).toBeInstanceOf(Array);
        expect(results.length).toEqual(0);
        results = instance.byText('');
        expect(results).toBeInstanceOf(Array);
        expect(results.length).toEqual(0);
      });

      describe('string selector', () => {
        let selector;
        beforeEach(() => {
          const queryMock = jest.spyOn(instance, 'query').mockImplementation(() => {});
          instance.byText('text');
          selector = queryMock.mock.calls[0][0];
        });

        it('should equality match a string with textContent', () => {
          const matchNode = { textContent: 'text' };
          const noMatchNode = { textContent: 'not text' };
          expect(selector(matchNode)).toBe(matchNode);
          expect(selector(noMatchNode)).toBeUndefined();
        });

        it('should equality match a string with innerText', () => {
          const matchNode = { innerText: 'text' };
          const noMatchNode = { innerText: 'not text' };
          expect(selector(matchNode)).toBe(matchNode);
          expect(selector(noMatchNode)).toBeUndefined();
        });
      });

      describe('regex selector', () => {
        let selector;
        beforeEach(() => {
          const queryMock = jest.spyOn(instance, 'query').mockImplementation(() => {});
          instance.byText(/text/);
          selector = queryMock.mock.calls[0][0];
        });

        it('should regex.test a string with textContent', () => {
          const matchNode = { textContent: 'text' };
          const noMatchNode = { textContent: 'not match' };
          expect(selector(matchNode)).toBe(matchNode);
          expect(selector(noMatchNode)).toBeUndefined();
        });

        it('should regex.test a string with innerText', () => {
          const matchNode = { innerText: 'text' };
          const noMatchNode = { innerText: 'not match' };
          expect(selector(matchNode)).toBe(matchNode);
          expect(selector(noMatchNode)).toBeUndefined();
        });
      });
    });

    describe('query', () => {
      it('should be a function', () => {
        expect(instance.query).toBeInstanceOf(Function);
      });

      it('should execute a selector on every node of the input tree', () => {
        const selectorMock = jest.fn();
        const node = {
          children: [{}, {}],
        };
        instance = new Queries(node);
        instance.query(selectorMock);
        expect(selectorMock).toHaveBeenCalledTimes(3);
        expect(selectorMock).toHaveBeenCalledWith(node);
        expect(selectorMock).toHaveBeenCalledWith(node.children[0]);
        expect(selectorMock).toHaveBeenCalledWith(node.children[1]);
      });

      it('should return an array of results by default', () => {
        const selectorMock = jest.fn();
        const node = {
          children: [
            {
              found: true,
            },
            {
              children: [
                {
                  found: true,
                }
              ],
            }
          ],
        };
        instance = new Queries(node);
        const results = instance.query(selectorMock);
        expect(selectorMock).toHaveBeenCalledTimes(4);
        expect(results.length).toEqual(0);
      });

      it('should add anything returned from a selector to a list of results', () => {
        const selectorMock = jest.fn(node => {
          if (node.found) return node;
        });
        const node = {
          children: [
            {
              found: true,
            },
            {
              children: [
                {
                  found: true,
                }
              ],
            }
          ],
        };
        instance = new Queries(node);
        const results = instance.query(selectorMock);
        expect(results.length).toEqual(2);
        expect(results[0]).toBe(node.children[0]);
        expect(results[1]).toBe(node.children[1].children[0]);
      });
    });
  });
});
