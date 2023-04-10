import * as DOM from '@msinnes/dom';
import { render } from '@msinnes/dom-testing-library';

import '..';

describe('api', () => {
  it('should test if an element is on one screen or another', () => {
    const screen1 = render(DOM.createElement('div', {}, ['text']));
    const screen2 = render(DOM.createElement('div', {}, ['text']));
    const div1 = screen1.getByText('text');
    const div2 = screen2.getByText('text');
    expect(div1).toBeOn(screen1);
    expect(div2).not.toBeOn(screen1);
    expect(div1).not.toBeOn(screen2);
    expect(div2).toBeOn(screen2);
  });

  it('should test if multiple elements are on a screen', () => {
    const screen = render([
      DOM.createElement('div', {}, ['text']),
      DOM.createElement('div', {}, ['text']),
    ]);
    const divs = screen.getAllByText('text');
    expect(divs).toBeOn(screen);
  });

  it('should test if an element has an attribute', () => {
    const screen = render(DOM.createElement('a', { href: 'href' }, ['text']));
    const a = screen.getByText('text');
    expect(a).toBeOn(screen);
    expect(a).toHaveAttribute('href', 'href');
  });

  it('should test if an element has multiple attributes', () => {
    const screen = render(DOM.createElement('div', { prop1: 'prop1', prop2: 'prop2' }, ['text']));
    const div = screen.getByText('text');
    expect(div).toBeOn(screen);
    expect(div).toHaveAttributes({
      prop1: 'prop1',
      prop2: 'prop2',
    });
  });
});
