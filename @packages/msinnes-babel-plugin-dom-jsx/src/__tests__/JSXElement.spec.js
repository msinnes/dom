import { process } from './process';

import plugins from '..';

describe('JSXElement', () => {
  it('should process case 1', () => {
const jsx = '<SomeClass />';
const expected = `({
  signature: SomeClass
});`;
    const out = process(jsx, plugins);
    expect(out).toEqual(expected);
  });

  it('should process case 2', () => {
const jsx = '<div />';
const expected = `({
  signature: "div"
});`;
    const out = process(jsx, plugins);
    expect(out).toEqual(expected);
  });

  it('should process case 3', () => {
const jsx = '<acronym />';
    expect(() => {
      process(jsx, plugins);
    }).toThrow('TypeError:');
  });

  it('should process case 4', () => {
const jsx = '<div prop1={\'123\'} />';
const expected = `({
  signature: "div",
  props: {
    prop1: '123'
  }
});`;
    const out = process(jsx, plugins);
    expect(out).toEqual(expected);
  });

  it('should process case 5', () => {
const jsx = '<div prop1={{ subProp: \'123\' }} prop2={123} />';
const expected = `({
  signature: "div",
  props: {
    prop1: {
      subProp: '123'
    },
    prop2: 123
  }
});`;
    const out = process(jsx, plugins);
    expect(out).toEqual(expected);
  });

  it('should process case 6', () => {
const jsx = '<div prop1={{ subProp: \'123\' }} prop2="123" />';
const expected = `({
  signature: "div",
  props: {
    prop1: {
      subProp: '123'
    },
    prop2: "123"
  }
});`;
    const out = process(jsx, plugins);
    expect(out).toEqual(expected);
  });

  it('should process case 7', () => {
const jsx = `<div>
  <div />
</div>`;
const expected = `({
  signature: "div",
  children: [{
    signature: "div"
  }]
});`;
    const out = process(jsx, plugins);
    expect(out).toEqual(expected);
  });

  it('should process case 8', () => {
const jsx = `<div>
  some text
</div>`;
const expected = `({
  signature: "div",
  children: ["\\n  some text\\n"]
});`;
    const out = process(jsx, plugins);
    expect(out).toEqual(expected);
  });

  it('should process case 9', () => {
const jsx = `<ul>
  {items.map(item => <li>{item}</li>)}
</ul>`;
const expected = `({
  signature: "ul",
  children: [items.map(item => ({
    signature: "li",
    children: [item]
  }))]
});`;
    const out = process(jsx, plugins);
    expect(out).toEqual(expected);
  });

  it('should process case 10', () => {
const jsx = '<div beforeProp="123" {...props} afterProp={1} />';
const expected = `({
  signature: "div",
  props: {
    beforeProp: "123",
    ...props,
    afterProp: 1
  }
});`;
    const out = process(jsx, plugins);
    expect(out).toEqual(expected);
  });

  it('should process case 11', () => {
const jsx = '<div exact />';
const expected = `({
  signature: "div",
  props: {
    exact: true
  }
});`;
    const out = process(jsx, plugins);
    expect(out).toEqual(expected);
  });

  it('should process case 12', () => {
const jsx = `<div>
  {() => {}}
</div>`;
const expected = `({
  signature: "div",
  children: [() => {}]
});`;
    const out = process(jsx, plugins);
    expect(out).toEqual(expected);
  });

  it('should process case 13', () => {
const jsx = `
<View>
  {/* Inline comment*/}
  {/*
    Multiline
    comment
  */}
</View>
`;
const expected = `({
  signature: View,
  children: []
});`;
    const out = process(jsx, plugins);
    expect(out).toEqual(expected);
  });

  it('should process case 14', () => {
const jsx = `
<Context.Provider>
  <div />
</Context.Provider>`;
const expected = `({
  signature: Context.Provider,
  children: [{
    signature: "div"
  }]
});`;
    const out = process(jsx, plugins);
    expect(out).toEqual(expected);
  });
});
