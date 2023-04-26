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
      container = { tagName: 'DIV' };
      ssrScope = { body: { elem: container } };
      renderController = { scope: ssrScope };
      instance = new Screen(renderController);
    });

    it('should set the container prop from the input controller', () => {
      expect(instance.container).toBe(container);
    });

    describe('getByLabelText', () => {
      it('should be a function', () => {
        expect(instance.getByLabelText).toBeInstanceOf(Function);
      });

      it('should return queried result', () => {
        container.children = [
          { textContent: 'not match', for: 'not name', children: [] },
          { textContent: 'match', for: 'name', children: [] },
          { children: [{ name: 'name', children: [] }, { name: 'not name', children: [] }]},
        ];
        const result = instance.getByLabelText('match');
        expect(result).toBe(container.children[2].children[0]);
      });

      it('should throw an error if no results are found', () => {
        expect(() => {
          instance.getByLabelText();
        }).toThrow('getByLabelText did not find any results');
      });

      it('should throw an error if more than one result is found', () => {
        container.children = [
          { textContent: 'not match', for: 'not name', children: [] },
          { textContent: 'match', for: 'name', children: [] },
          { children: [{ name: 'name', children: [] }, { name: 'name', children: [] }]},
        ];
        expect(() => {
          instance.getByLabelText('match');
        }).toThrow('getByLabelText found more than one result');
      });
    });

    describe('getByRole', () => {
      it('should be a function', () => {
        expect(instance.getByRole).toBeInstanceOf(Function);
      });

      it('should return queried result', () => {
        container.children = [
          { role: 'not match', tagName: 'BUTTON' },
          { role: 'match' },
        ];
        const result = instance.getByRole('match');
        expect(result).toBe(container.children[1]);
      });

      it('should throw an error if no results are found', () => {
        expect(() => {
          instance.getByRole();
        }).toThrow('getByRole did not find any results');
      });

      it('should throw an error if more than one result is found', () => {
        container.children = [
          { role: 'match' },
          { role: 'match' },
        ];
        expect(() => {
          instance.getByRole('match');
        }).toThrow('getByRole found more than one result');
      });
    });

    describe('getByText', () => {
      it('should be a function', () => {
        expect(instance.getByText).toBeInstanceOf(Function);
      });

      it('should return queried result', () => {
        container.children = [
          { textContent: 'not match', children: [] },
          { textContent: 'match', children: [] },
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
          { textContent: 'match', children: [] },
          { textContent: 'match', children: [] },
        ];
        expect(() => {
          instance.getByText('match');
        }).toThrow('getByText found more than one result');
      });
    });

    describe('getAllByLabelText', () => {
      it('should be a function', () => {
        expect(instance.getAllByLabelText).toBeInstanceOf(Function);
      });

      it('should return queried results', () => {
        container.children = [
          { textContent: 'not match', for: 'not name', children: [] },
          { textContent: 'match', for: 'name', children: [] },
          { children: [{ name: 'name', children: [] }, { name: 'not name', children: [] }]},
        ];
        const results = instance.getAllByLabelText('match');
        expect(results.length).toEqual(1);
        expect(results[0]).toBe(container.children[2].children[0]);
      });

      it('should throw an error if no results are found', () => {
        expect(() => {
          instance.getAllByLabelText();
        }).toThrow('getAllByLabelText did not find any results');
      });
    });

    describe('getAllByRole', () => {
      it('should be a function', () => {
        expect(instance.getAllByRole).toBeInstanceOf(Function);
      });

      it('should return queried results', () => {
        container.children = [
          { role: 'not match', tagName: 'DIV' },
          { role: 'match' },
        ];
        const results = instance.getAllByRole('match');
        expect(results.length).toEqual(1);
        expect(results[0]).toBe(container.children[1]);
      });

      it('should throw an error if no results are found', () => {
        expect(() => {
          instance.getAllByRole();
        }).toThrow('getAllByRole did not find any results');
      });
    });

    describe('getAllByText', () => {
      it('should be a function', () => {
        expect(instance.getAllByText).toBeInstanceOf(Function);
      });

      it('should return queried results', () => {
        container.children = [
          { textContent: 'not match', children: [] },
          { textContent: 'match', children: [] },
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

    describe('queryAllByLabelText', () => {
      it('should be a function', () => {
        expect(instance.queryAllByLabelText).toBeInstanceOf(Function);
      });

      it('should return an array by default', () => {
        let results = instance.queryAllByLabelText();
        expect(results).toBeInstanceOf(Array);
        expect(results.length).toEqual(0);
        results = instance.queryAllByLabelText('');
        expect(results).toBeInstanceOf(Array);
        expect(results.length).toEqual(0);
      });

      it('should return a matching node', () => {
        container.children = [
          { role: 'not match', tagName: 'DIV', children: [{ name: 'name', children: [] }] },
          { textContent: 'match', for: 'name', children: [] },
          { role: 'not match', tagName: 'DIV', children: [{ name: 'also name', children: [] }] },
          { textContent: 'match', for: 'also name', children: [] },
        ];
        const results = instance.queryAllByLabelText('match');
        expect(results.length).toEqual(2);
        expect(results[0]).toBe(container.children[0].children[0]);
        expect(results[1]).toBe(container.children[2].children[0]);
      });
    });

    describe('queryAllByRole', () => {
      it('should be a function', () => {
        expect(instance.queryAllByRole).toBeInstanceOf(Function);
      });

      it('should return an array by default', () => {
        let results = instance.queryAllByRole();
        expect(results).toBeInstanceOf(Array);
        expect(results.length).toEqual(0);
        results = instance.queryAllByRole('');
        expect(results).toBeInstanceOf(Array);
        expect(results.length).toEqual(0);
      });

      it('should return a matching node', () => {
        container.children = [
          { role: 'not match', tagName: 'DIV', children: [{ role: 'match', children: [] }] },
          { role: 'match', children: [] },
        ];
        const results = instance.queryAllByRole('match');
        expect(results.length).toEqual(2);
        expect(results[0]).toBe(container.children[0].children[0]);
        expect(results[1]).toBe(container.children[1]);
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
          { textContent: 'not match', children: [{ textContent: 'match', children: [] }] },
          { textContent: 'match', children: [] },
        ];
        const results = instance.queryAllByText('match');
        expect(results.length).toEqual(2);
        expect(results[0]).toBe(container.children[0].children[0]);
        expect(results[1]).toBe(container.children[1]);
      });
    });

    describe('time', () => {
      let playMock;
      let runMock;
      beforeEach(() => {
        playMock = jest.fn();
        runMock = jest.fn();
        ssrScope.time = {
          play: playMock,
          run: runMock,
        };
      });

      it('should be an object on the screen', () => {
        expect(instance.time).toBeDefined();
        expect(instance.time).toBeInstanceOf(Object);
      });

      describe('play', () => {
        it('should be a function', () => {
          expect(instance.time.play).toBeInstanceOf(Function);
        });

        it('should call time.play once if no parameter is passed', () => {
          instance.time.play();
          expect(playMock).toHaveBeenCalledTimes(1);
        });

        it('should not do anything if a number less than or equal to 0 is passed', () => {
          instance.time.play(0);
          expect(playMock).not.toHaveBeenCalled();
          instance.time.play(-Infinity);
          expect(playMock).not.toHaveBeenCalled();
        });

        it('should tick the clock n times if n is passed as a parameter', () => {
          instance.time.play(1000);
          expect(playMock).toHaveBeenCalledTimes(1000);
        });
      });

      describe('runCurrentTimers', () => {
        it('should be a function', () => {
          expect(instance.time.runCurrentTimers).toBeInstanceOf(Function);
        });

        it('should execute the run mock', () => {
          instance.time.runCurrentTimers();
          expect(runMock).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});
