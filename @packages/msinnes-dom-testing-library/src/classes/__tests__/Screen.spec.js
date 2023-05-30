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
      ssrScope = { body: { elem: container }, enable: jest.fn(), disable: jest.fn() };
      renderController = { scope: ssrScope, digest: jest.fn(), processHandler: jest.fn() };
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
      let tickMock;
      let getNextMock;
      let getAllMock;
      beforeEach(() => {
        tickMock = jest.fn();
        getNextMock = jest.fn();
        getAllMock = jest.fn();
        ssrScope.time = {
          tick: tickMock,
          getNext: getNextMock,
          getAll: getAllMock,
        };
      });

      it('should be an object on the screen', () => {
        expect(instance.time).toBeDefined();
        expect(instance.time).toBeInstanceOf(Object);
      });

      describe('next', () => {
        it('should be a function', () => {
          expect(instance.time.next).toBeInstanceOf(Function);
        });

        it('should enable and disable the scope', () => {
          instance.time.next();
          expect(ssrScope.enable).toHaveBeenCalledTimes(1);
          expect(ssrScope.disable).toHaveBeenCalledTimes(1);
        });

        it('should call scope.time.getNext and pass it to controller.processHandler', () => {
          const timer = {};
          getNextMock.mockReturnValue(timer);
          instance.time.next();
          expect(getNextMock).toHaveBeenCalledTimes(1);
          expect(renderController.processHandler).toHaveBeenCalledTimes(1);
          expect(renderController.processHandler).toHaveBeenCalledWith(timer);
        });

        it('should call scope.time.getNext and not do anything if there is no next timer', () => {
          getNextMock.mockReturnValue();
          instance.time.next();
          expect(getNextMock).toHaveBeenCalledTimes(1);
          expect(renderController.processHandler).toHaveBeenCalledTimes(0);
        });
      });

      describe('play', () => {
        it('should be a function', () => {
          expect(instance.time.play).toBeInstanceOf(Function);
        });

        it('should call time.tick and controller.digest once if no parameter is passed', () => {
          instance.time.play();
          expect(tickMock).toHaveBeenCalledTimes(1);
          expect(renderController.digest).toHaveBeenCalledTimes(1);
        });

        it('should not do anything if a number less than or equal to 0 is passed', () => {
          instance.time.play(0);
          expect(tickMock).not.toHaveBeenCalled();
          instance.time.play(-Infinity);
          expect(tickMock).not.toHaveBeenCalled();
        });

        it('should tick the clock n times if n is passed as a parameter', () => {
          instance.time.play(1000);
          expect(tickMock).toHaveBeenCalledTimes(1000);
          expect(renderController.digest).toHaveBeenCalledTimes(1000);
        });

        it('should enable and disable the scope', () => {
          instance.time.play();
          expect(ssrScope.enable).toHaveBeenCalledTimes(1);
          expect(ssrScope.disable).toHaveBeenCalledTimes(1);
          instance.time.play(10);
          expect(ssrScope.enable).toHaveBeenCalledTimes(2);
          expect(ssrScope.disable).toHaveBeenCalledTimes(2);
        });
      });

      describe('run', () => {
        it('should be a function', () => {
          expect(instance.time.run).toBeInstanceOf(Function);
        });

        it('should enable and disable the scope', () => {
          getAllMock.mockReturnValue([]);
          instance.time.run();
          expect(ssrScope.enable).toHaveBeenCalledTimes(1);
          expect(ssrScope.disable).toHaveBeenCalledTimes(1);
        });

        it('should call scope.time.getAll and pass each one to controller.processHandler', () => {
          const timer1 = {};
          const timer2 = {};
          getAllMock.mockReturnValue([timer1, timer2]);
          instance.time.run();
          expect(getAllMock).toHaveBeenCalledTimes(1);
          expect(renderController.processHandler).toHaveBeenCalledTimes(2);
          expect(renderController.processHandler).toHaveBeenCalledWith(timer1);
          expect(renderController.processHandler).toHaveBeenCalledWith(timer2);
        });
      });

      describe('tick', () => {
        it('should be a function', () => {
          expect(instance.time.tick).toBeInstanceOf(Function);
        });

        it('should call scope.time.tick', () => {
          instance.time.tick();
          expect(tickMock).toHaveBeenCalledTimes(1);
        });

        it('should call scope.time.tick n times if a value is passed', () => {
          instance.time.tick(10);
          expect(tickMock).toHaveBeenCalledTimes(10);
        });

        it('should do nothing if a value less than or equal to 0 is passed', () => {
          instance.time.tick(0);
          expect(tickMock).toHaveBeenCalledTimes(0);
          instance.time.tick(-10);
          expect(tickMock).toHaveBeenCalledTimes(0);
          instance.time.tick();
          expect(tickMock).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe('fetch', () => {
      let tickMock;
      let getNextMock;
      let getAllMock;
      beforeEach(() => {
        tickMock = jest.fn();
        getNextMock = jest.fn();
        getAllMock = jest.fn();
        ssrScope.fetch = {
          tick: tickMock,
          getNext: getNextMock,
          getAll: getAllMock,
        };
      });

      it('should be an object on the screen', () => {
        expect(instance.fetch).toBeDefined();
        expect(instance.fetch).toBeInstanceOf(Object);
      });

      describe('next', () => {
        it('should be a function', () => {
          expect(instance.fetch.next).toBeInstanceOf(Function);
        });

        it('should enable and disable the scope', () => {
          instance.fetch.next();
          expect(ssrScope.enable).toHaveBeenCalledTimes(1);
          expect(ssrScope.disable).toHaveBeenCalledTimes(1);
        });

        it('should call scope.time.getNext and pass it to controller.processHandler', () => {
          const fetchHandler = {};
          getNextMock.mockReturnValue(fetchHandler);
          instance.fetch.next();
          expect(getNextMock).toHaveBeenCalledTimes(1);
          expect(renderController.processHandler).toHaveBeenCalledTimes(1);
          expect(renderController.processHandler).toHaveBeenCalledWith(fetchHandler);
        });

        it('should call scope.time.getNext and not do anything if there is no next timer', () => {
          getNextMock.mockReturnValue();
          instance.fetch.next();
          expect(getNextMock).toHaveBeenCalledTimes(1);
          expect(renderController.processHandler).toHaveBeenCalledTimes(0);
        });
      });

      describe('run', () => {
        it('should be a function', () => {
          expect(instance.fetch.run).toBeInstanceOf(Function);
        });

        it('should enable and disable the scope', () => {
          getAllMock.mockReturnValue([]);
          instance.fetch.run();
          expect(ssrScope.enable).toHaveBeenCalledTimes(1);
          expect(ssrScope.disable).toHaveBeenCalledTimes(1);
        });

        it('should call scope.fetch.getAll and pass each one to controller.processHandler', () => {
          const fetchHandler1 = {};
          const fetchHandler2 = {};
          getAllMock.mockReturnValue([fetchHandler1, fetchHandler2]);
          instance.fetch.run();
          expect(getAllMock).toHaveBeenCalledTimes(1);
          expect(renderController.processHandler).toHaveBeenCalledTimes(2);
          expect(renderController.processHandler).toHaveBeenCalledWith(fetchHandler1);
          expect(renderController.processHandler).toHaveBeenCalledWith(fetchHandler2);
        });
      });
    });
  });
});
