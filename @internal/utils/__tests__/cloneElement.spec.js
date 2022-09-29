import cloneElement from '../cloneElement';

describe('cloneElement', () => {
  it('should be a function', () => {
    expect(cloneElement).toBeInstanceOf(Function);
  });

  it('should return a new render with the same signature', () => {
    const render = cloneElement({ signature: 'signature' });
    expect(render).toMatchObject({
      signature: 'signature',
      props: {},
      children: [],
    });
  });

  it('should shallow merge clone props if they are passed', () => {
    const propsRef = { prop1: 'prop1' };
    const render = cloneElement({ signature: 'signature', props: propsRef });
    expect(render).toMatchObject({
      signature: 'signature',
      props: propsRef,
      children: [],
    });
    expect(render.props.prop1).toBe('prop1');
  });

  it('should shallow merge new props if they are passed', () => {
    const propsRef = { prop1: 'prop1' };
    const render = cloneElement({ signature: 'signature' }, propsRef);
    expect(render).toMatchObject({
      signature: 'signature',
      props: propsRef,
      children: [],
    });
    expect(render.props.prop1).toBe('prop1');
  });

  it('should shallow merge clone props then new props if both are passed', () => {
    const propsRef = {
      prop1: 'prop1',
      prop2: 'prop2',
    };
    const newPropsRef = {
      prop1: 'newProp1',
    };
    const render = cloneElement({ signature: 'signature', props: propsRef }, newPropsRef);
    expect(render).toMatchObject({
      signature: 'signature',
      props: { ...propsRef, ...newPropsRef },
      children: [],
    });
    expect(render.props.prop1).toBe('newProp1');
  });

  it('should assign clone children if they are passed', () => {
    const childrenRef = {};
    const render = cloneElement({ signature: 'signature', children: childrenRef });
    expect(render).toMatchObject({
      signature: 'signature',
      props: {},
      children: childrenRef,
    });
    expect(render.children).toBe(childrenRef);
  });

  it('should assign new children if they are passed', () => {
    const childrenRef = {};
    const render = cloneElement({ signature: 'signature' }, undefined, childrenRef);
    expect(render).toMatchObject({
      signature: 'signature',
      props: {},
      children: childrenRef,
    });
    expect(render.children).toBe(childrenRef);
  });
});