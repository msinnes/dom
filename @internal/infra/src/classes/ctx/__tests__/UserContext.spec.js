import { UserContext } from '../UserContext';

describe('UserContext', () => {
  it('should be a class', () => {
    expect(UserContext).toBeAClass();
  });

  describe('instance', () => {
    let instance;
    let addValueMock;
    let AppContext;
    beforeEach(() => {
      addValueMock = jest.fn();
      AppContext = {
        addValue: addValueMock,
        value: 'mock value',
      };
      instance = new UserContext(AppContext);
    });

    describe('Provider', () => {
      it('should be a function', () => {
        expect(instance.Provider).toBeInstanceOf(Function);
      });

      it('should call the provide addValue mock with the value prop', () => {
        const childRef = [];
        const props = { value: 'provider value', children: childRef };
        const render = instance.Provider(props);
        expect(addValueMock).toHaveBeenCalledTimes(1);
        expect(addValueMock).toHaveBeenCalledWith('provider value');
        expect(render).toBe(childRef);
      });

      it('should not call the mock if no value prop is provided', () => {
        const childRef = [];
        const props = { children: childRef };
        const render = instance.Provider(props);
        expect(addValueMock).not.toHaveBeenCalled();
        expect(render).toBe(childRef);
      });

      it('should call execute a value function with existing value and call addvalue with the new value', () => {
        const childRef = [];
        const newValueRef = {};
        const valueMock = jest.fn();
        const value = (...args) => valueMock(...args);
        valueMock.mockReturnValue(newValueRef);
        const render = instance.Provider({ value, children: childRef });
        expect(valueMock).toHaveBeenCalledTimes(1);
        expect(valueMock).toHaveBeenCalledWith('mock value');
        expect(addValueMock).toHaveBeenCalledTimes(1);
        expect(addValueMock).toHaveBeenCalledWith(newValueRef);
      });
    });

    describe('Consumer', () => {
      it('should be a function', () => {
        expect(instance.Consumer).toBeInstanceOf(Function);
      });

      it('should execute the first child with the context value', () => {
        const firstChildMock = jest.fn();
        const props = { children: [firstChildMock] };
        instance.Consumer(props);
        expect(firstChildMock).toHaveBeenCalledTimes(1);
        expect(firstChildMock).toHaveBeenCalledWith('mock value');
      });

      it('should return the value returned from the first child function', () => {
        const firstChildMock = jest.fn();
        const props = { children: [firstChildMock] };
        const renderRef = {};
        firstChildMock.mockImplementation(() => renderRef);
        const result = instance.Consumer(props);
        expect(firstChildMock).toHaveBeenCalledTimes(1);
        expect(firstChildMock).toHaveBeenCalledWith('mock value');
        expect(result).toBe(renderRef);
      });
    });
  });
});
