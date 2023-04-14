import { AppRef } from '../../classes/AppRef';
import { infra } from '../../infra';

import { createRef, useRef } from '../refs';

describe('createRef', () => {
  it('should be a function', () => {
    expect(createRef).toBeInstanceOf(Function);
  });

  it('should return an instance of AppRef', () => {
    const bodyRef = bodyRef;
    const ref = createRef(bodyRef);
    expect(ref).toBeInstanceOf(AppRef);
    expect(ref.elem).toBe(bodyRef);
  });
});

describe('useRef', () => {
  let createElementMock;
  let useMemoMock;
  let useMemoOriginal;
  beforeEach(() => {
    createElementMock = jest.fn().mockReturnValue({ tag: 'div' });
    useMemoMock = jest.fn();
    useMemoOriginal = infra.hooks.useMemo;
    infra.hooks.useMemo = useMemoMock;
    global.document = {
      createElement: createElementMock,
    };
  });

  afterEach(() => {
    infra.hooks.useMemo = useMemoOriginal;
  });

  it('should be a function', () => {
    expect(useRef).toBeInstanceOf(Function);
  });

  it('should call the useMemo mock', () => {
    useRef('div');
    expect(useMemoMock).toHaveBeenCalledTimes(1);
    const fn = useMemoMock.mock.calls[0][0];
    expect(fn).toBeInstanceOf(Function);
    const ref = fn();
    expect(ref).toBeInstanceOf(AppRef);
    expect(ref.elem.tag).toEqual('div');
  });
});
