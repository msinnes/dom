import * as api from '..';

import { DomRef } from '../classes/DomRef';
import { HtmlNode } from '../classes/HtmlNode';
import { RootNode } from '../classes/RootNode';
import { SvgNode } from '../classes/SvgNode';
import { SvgRef } from '../classes/SvgRef';
import { TextNode } from '../classes/TextNode';
import { TextRef } from '../classes/TextRef';

describe('api', () => {
  it('should expose the api', () => {
    expect(api.DomRef).toBe(DomRef);
    expect(api.HtmlNode).toBe(HtmlNode);
    expect(api.RootNode).toBe(RootNode);
    expect(api.SvgNode).toBe(SvgNode);
    expect(api.SvgRef).toBe(SvgRef);
    expect(api.TextNode).toBe(TextNode);
    expect(api.TextRef).toBe(TextRef);
  });
});
