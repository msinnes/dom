import { traverse } from '../traverse';

describe('traverse', () => {
  it('should be a function', () => {
    expect(traverse).toBeInstanceOf(Function);
  });

  it('should execute a callback on a node', () => {
    const callbackMock = jest.fn();
    const node = {};
    traverse(node, callbackMock);
    expect(callbackMock).toHaveBeenCalledTimes(1);
    expect(callbackMock).toHaveBeenCalledWith(node);
  });

  it('should execute a callback on a node and its children', () => {
    const callbackMock = jest.fn();
    const node = {
      children: [
        {},
        {},
      ],
    };
    traverse(node, callbackMock);
    expect(callbackMock).toHaveBeenCalledTimes(3);
    expect(callbackMock).toHaveBeenCalledWith(node);
    expect(callbackMock).toHaveBeenCalledWith(node.children[0]);
    expect(callbackMock).toHaveBeenCalledWith(node.children[1]);
  });

  it('should execute a callback recursively down a tree of nodes', () => {
    const callbackMock = jest.fn();
    const node = {
      children: [
        {
          children: [{}],
        },
      ],
    };
    traverse(node, callbackMock);
    expect(callbackMock).toHaveBeenCalledTimes(3);
    expect(callbackMock).toHaveBeenCalledWith(node);
    expect(callbackMock).toHaveBeenCalledWith(node.children[0]);
    expect(callbackMock).toHaveBeenCalledWith(node.children[0].children[0]);
  });
});
