const process = require('./process');

const plugins = require('..');

const case1In = `<>
  <div />
  <SomeClass />
</>`
const case1Out =`[{
  signature: "div"
}, {
  signature: SomeClass
}];`;

const case2In = `<>
  <div>Title</div>
  text
</>`;
const case2Out = `[{
  signature: "div",
  children: ["Title"]
}, "\\n  text\\n"];`;

const case3In = `
  <>
    {/* Inline comment */}
    {/* Multiline
    comment */}
  </>
`;
const case3Out = `[];`;

describe('JSXFragment', () => {
  it('should process a fragment', () => {
    const out = process(case1In, plugins);
    expect(out).toEqual(case1Out);
  });

  it('should process a fragment with a text node adjacent to an element', () => {
    const out = process(case2In, plugins);
    expect(out).toEqual(case2Out);
  });

  it('should process comments', () => {
    const out = process(case3In, plugins);
    expect(out).toEqual(case3Out);
  });
});