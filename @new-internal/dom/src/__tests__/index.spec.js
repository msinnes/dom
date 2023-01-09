import * as api from '..';

import { DomRef } from '../classes/DomRef';
import { ElementNode } from '../classes/ElementNode';
import { RootNode } from '../classes/RootNode';
import { TextNode } from '../classes/TextNode';
import { TextRef } from '../classes/TextRef';

describe('api', () => {
  it('should expose the api', () => {
    expect(api.DomRef).toBe(DomRef);
    expect(api.ElementNode).toBe(ElementNode);
    expect(api.RootNode).toBe(RootNode);
    expect(api.TextNode).toBe(TextNode);
    expect(api.TextRef).toBe(TextRef);
  });
});