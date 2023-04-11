import { createElement } from '@msinnes/dom';

import { renderToScreen, renderToString } from '../renderers';

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

describe('renderToScreen', () => {
  it('should be a function', () => {
    expect(renderToScreen).toBeInstanceOf(Function);
  });

  it('should render undefined to the dom', () => {
    const screen = renderToScreen(undefined);
    expect(screen.html).toEqual('');
  });

  it('should pass a config to the scope', () => {
    const Location = () => window.location.href;
    const screen = renderToScreen(createElement(Location), { url: 'http://url.com' });
    expect(screen.html).toEqual('http://url.com/');
    expect(screen.url).toEqual('http://url.com/');
  });
});
