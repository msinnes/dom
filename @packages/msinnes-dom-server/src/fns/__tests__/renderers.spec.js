import * as DOM from '@msinnes/dom';

import { renderToString, renderToScreen, renderToStringAsync, renderToScreenAsync } from '../renderers';

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
    const html = renderToString(DOM.createElement(Location), { url: 'http://url.com' });
    expect(html).toEqual('http://url.com/');
  });

  it('shoudl process a synchronously executed fetch call', () => {
    const Text = () => {
      const [text, setText] = DOM.useState('default text');
      DOM.useEffect(() => {
        if (text === 'default text') fetch('url').then(data => data.text()).then(setText);
      }, []);
      return text;
    };

    const html = renderToString(DOM.createElement(Text), {
      fetch: (req, res) => {
        res.text('async text');
        res.close();
      }
    });
    expect(html).toEqual('async text');
  });

  it('should not process an async request, and it should warn in the console', done => {
    const consoleWarnOriginal = console.warn;
    console.warn = jest.fn();
    const Text = () => {
      const [text, setText] = DOM.useState('default text');
      DOM.useEffect(() => {
        if (text === 'default text') fetch('url').then(data => data.text()).then(setText);
      }, []);
      return text;
    };

    const html = renderToString(DOM.createElement(Text), {
      fetch: (req, res) => {
        setTimeout(() => {
          res.text('async text');
          res.close();
          done();
        });
      }
    });
    expect(html).toEqual('default text');
    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledWith('Open Handles Detected -- Open handles are ignored after a render is closed');
    console.warn = consoleWarnOriginal;
    done();
  });

  it('should not log if fetch calls are supressed', () => {
    const consoleWarnOriginal = console.warn;
    console.warn = jest.fn();
    const Text = () => {
      const [text, setText] = DOM.useState('default text');
      DOM.useEffect(() => {
        if (text === 'default text') fetch('url').then(data => data.text()).then(setText);
      }, []);
      return text;
    };

    const html = renderToString(DOM.createElement(Text), {
      digestFetch: false,
      fetch: (req, res) => {
        setTimeout(() => {
          res.text('async text');
          res.close();
          done();
        });
      }
    });
    expect(html).toEqual('default text');
    expect(console.warn).not.toHaveBeenCalled();
    console.warn = consoleWarnOriginal;
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
    const screen = renderToScreen(DOM.createElement(Location), { url: 'http://url.com' });
    expect(screen.html).toEqual('http://url.com/');
    expect(screen.url).toEqual('http://url.com/');
  });

  it('should process a synchronously executed fetch call', () => {
    const Text = () => {
      const [text, setText] = DOM.useState('default text');
      DOM.useEffect(() => {
        if (text === 'default text') fetch('url').then(data => data.text()).then(setText);
      }, []);
      return text;
    };

    const screen = renderToScreen(DOM.createElement(Text), {
      fetch: (req, res) => {
        res.text('async text');
        res.close();
      }
    });
    expect(screen.html).toEqual('async text');
  });

  it('should not process an async request, and it should warn in the console', done => {
    const consoleWarnOriginal = console.warn;
    console.warn = jest.fn();
    const Text = () => {
      const [text, setText] = DOM.useState('default text');
      DOM.useEffect(() => {
        if (text === 'default text') fetch('url').then(data => data.text()).then(setText);
      }, []);
      return text;
    };

    const screen = renderToScreen(DOM.createElement(Text), {
      fetch: (req, res) => {
        setTimeout(() => {
          res.text('async text');
          res.close();
          done();
        });
      }
    });
    expect(screen.html).toEqual('default text');
    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledWith('Open Handles Detected -- Open handles are ignored after a render is closed');
    console.warn = consoleWarnOriginal;
  });

  it('should not log if fetch calls are supressed', () => {
    const consoleWarnOriginal = console.warn;
    console.warn = jest.fn();
    const Text = () => {
      const [text, setText] = DOM.useState('default text');
      DOM.useEffect(() => {
        if (text === 'default text') fetch('url').then(data => data.text()).then(setText);
      }, []);
      return text;
    };

    const screen = renderToScreen(DOM.createElement(Text), {
      digestFetch: false,
      fetch: (req, res) => {
        setTimeout(() => {
          res.text('async text');
          res.close();
          done();
        });
      }
    });
    expect(screen.html).toEqual('default text');
    expect(console.warn).not.toHaveBeenCalled();
    console.warn = consoleWarnOriginal;
  });
});

describe('renderToStringAsync', () => {
  it('should be a function', () => {
    expect(renderToStringAsync).toBeInstanceOf(Function);
  });

  it('should render undefined to the dom', async () => {
    const html = await renderToStringAsync(undefined);
    expect(html).toEqual('');
  });

  it('should render a screen with async behavior', async () => {
    const Text = () => {
      const [text, setText] = DOM.useState('default text');
      DOM.useEffect(() => {
        if (text === 'default text') fetch('url').then(data => data.text()).then(setText);
      }, []);
      return text;
    };

    const html = await renderToStringAsync(DOM.createElement(Text), {
      fetch: (req, res) => {
        setTimeout(() => {
          res.text('async text');
          res.close();
        });
      }
    });
    expect(html).toEqual('async text');
  });

  it('should reject the promise if a 2000ms timeout is exceeded', done => {
    let timeoutId;
    const Text = () => {
      const [text, setText] = DOM.useState('default text');
      DOM.useEffect(() => {
        if (text === 'default text') fetch('url').then(data => data.text()).then(setText);
      }, []);
      return text;
    };

    renderToStringAsync(DOM.createElement(Text), {
      fetch: (req, res) => {
        timeoutId = setTimeout(() => {
          res.text('async text');
          res.close();
        }, 2500);
      }
    }).then(() => {}, err => {
      expect(err).toEqual('Timeout Exceeded to resolve promise.');
      clearTimeout(timeoutId);
      done();
    });
  });

  it('should not reject the promise if the renderer is not resolving fetch', done => {
    let timeoutId;
    const Text = () => {
      const [text, setText] = DOM.useState('default text');
      DOM.useEffect(() => {
        if (text === 'default text') fetch('url').then(data => data.text()).then(setText);
      }, []);
      return text;
    };

    renderToStringAsync(DOM.createElement(Text), {
      digestFetch: false,
      fetch: (req, res) => {
        timeoutId = setTimeout(() => {
          res.text('async text');
          res.close();
        }, 2500);
      }
    }).then(html => {
      expect(html).toEqual('default text');
      clearTimeout(timeoutId);
      done();
    });
  });
});

describe('renderToScreenAsync', () => {
  it('should be a function', () => {
    expect(renderToScreenAsync).toBeInstanceOf(Function);
  });

  it('should render undefined to the dom', async () => {
    const screen = await renderToScreenAsync(undefined);
    expect(screen.html).toEqual('');
  });

  it('should render a screen with async behavior', async () => {
    const Text = () => {
      const [text, setText] = DOM.useState('default text');
      DOM.useEffect(() => {
        if (text === 'default text') fetch('url').then(data => data.text()).then(setText);
      }, []);
      return text;
    };

    const screen = await renderToScreenAsync(DOM.createElement(Text), {
      fetch: (req, res) => {
        setTimeout(() => {
          res.text('async text');
          res.close();
        });
      }
    });
    expect(screen.html).toEqual('async text');
  });

  it('should reject the promise if a 2000ms timeout is exceeded', done => {
    let timeoutId;
    const Text = () => {
      const [text, setText] = DOM.useState('default text');
      DOM.useEffect(() => {
        if (text === 'default text') fetch('url').then(data => data.text()).then(setText);
      }, []);
      return text;
    };

    renderToScreenAsync(DOM.createElement(Text), {
      fetch: (req, res) => {
        timeoutId = setTimeout(() => {
          res.text('async text');
          res.close();
        }, 2500);
      }
    }).then(() => {}, err => {
      expect(err).toEqual('Timeout Exceeded to resolve promise.');
      clearTimeout(timeoutId);
      done();
    });
  });

  it('should not reject the promise if the renderer is not resolving fetch', done => {
    let timeoutId;
    const Text = () => {
      const [text, setText] = DOM.useState('default text');
      DOM.useEffect(() => {
        if (text === 'default text') fetch('url').then(data => data.text()).then(setText);
      }, []);
      return text;
    };

    renderToScreenAsync(DOM.createElement(Text), {
      digestFetch: false,
      fetch: (req, res) => {
        timeoutId = setTimeout(() => {
          res.text('async text');
          res.close();
        }, 2500);
      }
    }).then(screen => {
      expect(screen.html).toEqual('default text');
      clearTimeout(timeoutId);
      done();
    });
  });
});
