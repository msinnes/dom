const process = require('./process');

const plugins = require('..');

const case1In = '<SomeClass />';
const case1Out = `({
  signature: SomeClass
});`;

const case2In = '<div />';
const case2Out = `({
  signature: "div"
});`;

const case3In = '<acronym />';

const case4In = '<div prop1={\'123\'} />';
const case4Out = `({
  signature: "div",
  props: {
    prop1: '123'
  }
});`;

const case5In = '<div prop1={{ subProp: \'123\' }} prop2={123} />';
const case5Out = `({
  signature: "div",
  props: {
    prop1: {
      subProp: '123'
    },
    prop2: 123
  }
});`;

const case6In = '<div prop1={{ subProp: \'123\' }} prop2="123" />';
const case6Out = `({
  signature: "div",
  props: {
    prop1: {
      subProp: '123'
    },
    prop2: "123"
  }
});`;

const case7In = `<div>
  <div />
</div>`;
const case7Out = `({
  signature: "div",
  children: [{
    signature: "div"
  }]
});`;

const case8In = `<div>
  some text
</div>`;
const case8Out = `({
  signature: "div",
  children: ["\\n  some text\\n"]
});`;

const case9In = `<ul>
  {items.map(item => <li>{item}</li>)}
</ul>`;
const case9Out = `({
  signature: "ul",
  children: [items.map(item => ({
    signature: "li",
    children: [item]
  }))]
});`;

const case10In = '<div beforeProp="123" {...props} afterProp={1} />';
const case10Out = `({
  signature: "div",
  props: {
    beforeProp: "123",
    ...props,
    afterProp: 1
  }
});`;

const case11In = '<div exact />';
const case11Out = `({
  signature: "div",
  props: {
    exact: true
  }
});`;

const case12In = `<div>
  {() => {}}
</div>`;
const case12Out = `({
  signature: "div",
  children: [() => {}]
});`;

const case13In = `
<View>
  {/* Inline comment*/}
  {/*
    Multiline
    comment
  */}
</View>
`;
const case13Out = `({
  signature: View,
  children: []
});`;

const case14In = `
<Context.Provider>
  <div />
</Context.Provider>`;
const case14Out = `({
  signature: Context.Provider,
  children: [{
    signature: "div"
  }]
});`;


describe('JSXElement', () => {
  describe('when there is only a signature', () => {
    it('should render an identifier signature', () => {
      const out = process(case1In, plugins);
      expect(out).toEqual(case1Out);
    });

    it('should render an html tag signature', () => {
      const out = process(case2In, plugins);
      expect(out).toEqual(case2Out);
    });

    it('should throw an error if the input is a deprecated html tag', () => {
      expect(() => {
        process(case3In, plugins);
      }).toThrow('TypeError:');
    });
  });

  describe('when there are props', () => {
    it('should render 1 prop', () => {
      const out = process(case4In, plugins);
      expect(out).toEqual(case4Out);
    });

    it('should render 1 prop', () => {
      const out = process(case5In, plugins);
      expect(out).toEqual(case5Out);
    });

    it('should render a string prop', () => {
      const out = process(case6In, plugins);
      expect(out).toEqual(case6Out);
    });
  });

  describe('when there are children', () => {
    it('should render an element child', () => {
      const out = process(case7In, plugins);
      expect(out).toEqual(case7Out);
    });

    it('should render a string child', () => {
      const out = process(case8In, plugins);
      expect(out).toEqual(case8Out);
    });

    it('should render an object child', () => {
      const out = process(case9In, plugins);
      expect(out).toEqual(case9Out);
    });
  });

  describe('when there are props spread onto a component', () => {
    it('should spread the props correctly', () => {
      const out = process(case10In, plugins);
      expect(out).toEqual(case10Out);
    });
  });

  describe('when a props does not have a value', () => {
    it('should set that prop to boolean true', () => {
      const out = process(case11In, plugins);
      expect(out).toEqual(case11Out);
    });
  });

  describe('when a child is a function', () => {
    it('should set the function as children', () => {
      const out = process(case12In, plugins);
      expect(out).toEqual(case12Out);
    });
  });

  describe('comments', () => {
    it('should remove jsx comments', () => {
      const out = process(case13In, plugins);
      expect(out).toEqual(case13Out);
    });
  });

  describe('dotted signatures', () => {
    it('should handle object accessors as signatures', () => {
      const out = process(case14In, plugins);
      expect(out).toEqual(case14Out);
    });
  });
});