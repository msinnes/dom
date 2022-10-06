/**
 * @jest-environment jsdom
 */
import { renderApp } from '@msinnes/dom';

import { App } from './test-app';

describe('e2e', () => {
  beforeEach(done => {
    renderApp(<App />, document.body);
    setTimeout(done);
  });

  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('should be rendered correctly', () => {
    expect(document.body.childNodes.length).toEqual(2);

    // Nav
    expect(document.body.childNodes[0].tagName).toEqual('UL');
    expect(document.body.childNodes[0].childNodes.length).toEqual(4);
    expect(document.body.childNodes[0].childNodes[0].tagName).toEqual('LI');
    expect(document.body.childNodes[0].childNodes[0].innerHTML).toEqual('<a href=\"/\">Home</a>');
    expect(document.body.childNodes[0].childNodes[1].tagName).toEqual('LI');
    expect(document.body.childNodes[0].childNodes[1].innerHTML).toEqual('<a href=\"/about\">About</a>');
    expect(document.body.childNodes[0].childNodes[2].tagName).toEqual('LI');
    expect(document.body.childNodes[0].childNodes[2].innerHTML).toEqual('<a href=\"/param/1\">Params</a>');
    expect(document.body.childNodes[0].childNodes[3].tagName).toEqual('LI');
    expect(document.body.childNodes[0].childNodes[3].innerHTML).toEqual('<a href=\"/anything\">Anything</a>');

    // Content
    expect(document.body.childNodes[1].textContent).toBe('Home');
  });

  it('should navigate when \'About\' is clicked', done => {
    document.body.childNodes[0].childNodes[1].childNodes[0].click();
    setTimeout(() => {
      setTimeout(() => {
        setTimeout(() => {
          // Nav
          expect(document.body.childNodes[0].tagName).toEqual('UL');
          expect(document.body.childNodes[0].childNodes.length).toEqual(4);
          expect(document.body.childNodes[0].childNodes[0].tagName).toEqual('LI');
          expect(document.body.childNodes[0].childNodes[0].innerHTML).toEqual('<a href=\"/\">Home</a>');
          expect(document.body.childNodes[0].childNodes[1].tagName).toEqual('LI');
          expect(document.body.childNodes[0].childNodes[1].innerHTML).toEqual('<a href=\"/about\">About</a>');
          expect(document.body.childNodes[0].childNodes[2].tagName).toEqual('LI');
          expect(document.body.childNodes[0].childNodes[2].innerHTML).toEqual('<a href=\"/param/1\">Params</a>');
          expect(document.body.childNodes[0].childNodes[3].tagName).toEqual('LI');
          expect(document.body.childNodes[0].childNodes[3].innerHTML).toEqual('<a href=\"/anything\">Anything</a>');

          // Content
          expect(document.body.childNodes[1].textContent).toBe('About');
          done();
        });
      });
    });
  });

  it('should navigate to \'About\' when \'Anything\' is clicked', done => {
    document.body.childNodes[0].childNodes[3].childNodes[0].click();
    setTimeout(() => {
      setTimeout(() => {
        // Nav
        expect(document.body.childNodes[0].tagName).toEqual('UL');
        expect(document.body.childNodes[0].childNodes.length).toEqual(4);
        expect(document.body.childNodes[0].childNodes[0].tagName).toEqual('LI');
        expect(document.body.childNodes[0].childNodes[0].innerHTML).toEqual('<a href=\"/\">Home</a>');
        expect(document.body.childNodes[0].childNodes[1].tagName).toEqual('LI');
        expect(document.body.childNodes[0].childNodes[1].innerHTML).toEqual('<a href=\"/about\">About</a>');
        expect(document.body.childNodes[0].childNodes[2].tagName).toEqual('LI');
        expect(document.body.childNodes[0].childNodes[2].innerHTML).toEqual('<a href=\"/param/1\">Params</a>');
        expect(document.body.childNodes[0].childNodes[3].tagName).toEqual('LI');
        expect(document.body.childNodes[0].childNodes[3].innerHTML).toEqual('<a href=\"/anything\">Anything</a>');

        // Content
        expect(document.body.childNodes[1].textContent).toBe('About');
        done();
      });
    });
  });
});