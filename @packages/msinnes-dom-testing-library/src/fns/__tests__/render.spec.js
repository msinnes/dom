import { createElement } from '@msinnes/dom';

import { Screen } from '../../classes/Screen';

import { render } from '../render';

describe('render', () => {
  it('should be a function', () => {
    expect(render).toBeInstanceOf(Function);
  });

  it('should return a screen', () => {
    const screen = render('text');
    expect(screen).toBeInstanceOf(Screen);
    expect(screen.container.innerHTML).toEqual('text');
  });

  it('should pass the url to the ssr scope', () => {
    const Location = () => window.location.href;
    const screen = render(createElement(Location), { url: 'http://url.com' });
    expect(screen.container.innerHTML).toEqual('http://url.com/');
  });
});
