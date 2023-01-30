import { createElement } from '@new-msinnes/dom';

import { renderToString } from '../renderToString';

describe('renderToString', () => {
  it('should be a function', () => {
    expect(renderToString).toBeInstanceOf(Function);
  });

  it('should render undefined to the dom', () => {
    const html = renderToString(undefined);
    expect(html).toEqual('');
  });

  it('should pass a config to the scope', () => {
    const Location = () => window.location.href;
    const html = renderToString(createElement(Location), { url: 'http://url.com' });
    expect(html).toEqual('http://url.com/');
  });
});
