import createElement from '../createElement';

describe('createElement', () => {
  it('should be a function', () => {
    expect(createElement).toBeInstanceOf(Function);
  });

  it('should return a valid render if only a signature is passed', () => {
    const render = createElement('signature');
    expect(render).toMatchObject({
      signature: 'signature',
      props: {},
      children: [],
    });
  });

  it('should assign props if they are passed', () => {
    const propsRef = {};
    const render = createElement('signature', propsRef);
    expect(render).toMatchObject({
      signature: 'signature',
      props: propsRef,
      children: [],
    });
    expect(render.props).toBe(propsRef);
  });

  it('should assign children if they are passed', () => {
    const childrenRef = [];
    const render = createElement('signature', {}, childrenRef);
    expect(render).toMatchObject({
      signature: 'signature',
      props: {},
      children: childrenRef,
    });
    expect(render.children).toBe(childrenRef);
  });
});