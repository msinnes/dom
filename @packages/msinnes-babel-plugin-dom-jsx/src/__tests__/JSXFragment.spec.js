import { process } from './process';

import plugins from '..';

describe('JSXFragment', () => {
  it('should process case 1', () => {
const jsx = `<>
  <div />
  <SomeClass />
</>`;
const expected = `[{
  signature: "div"
}, {
  signature: SomeClass
}];`;
    const out = process(jsx, plugins);
    expect(out).toEqual(expected);
  });

  it('should process case 2', () => {
const jsx = `<>
  <div>Title</div>
  text
</>`;
const expected = `[{
  signature: "div",
  children: ["Title"]
}, "\\n  text\\n"];`;
    const out = process(jsx, plugins);
    expect(out).toEqual(expected);
  });

  it('should process case 3', () => {
const jsx = `
  <>
    {/* Inline comment */}
    {/* Multiline
    comment */}
  </>
`;
const expected = `[];`;
    const out = process(jsx, plugins);
    expect(out).toEqual(expected);
  });
});
