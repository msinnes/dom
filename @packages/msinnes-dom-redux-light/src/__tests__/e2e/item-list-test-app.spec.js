/**
 * @jest-environment jsdom
 */
import { renderApp } from '@msinnes/dom';

import { App } from './item-list-test-app';

describe('index.item-list-test-app.e2e', () => {
  const clickAddItemButton = () => {
    document.body.firstChild.nextSibling.click();
    return new Promise(resolve => {
      setTimeout(() => {
        setTimeout(() => {
          setTimeout(() => {
            setTimeout(() => {
              setTimeout(() => {
                resolve();
              });
            });
          });
        });
      });
    });
  };

  const clickCancelAddItemButton = () => {
    document.body.firstChild.nextSibling.firstChild.nextSibling.click();
    return new Promise(resolve => {
      setTimeout(() => {
        setTimeout(() => {
          setTimeout(() => {
            setTimeout(() => {
              setTimeout(() => {
                resolve();
              });
            });
          });
        });
      });
    });
  };

  const inputAddItem = () => {
    const e = new InputEvent('input', { data: 'm' });
    document.body.firstChild.dispatchEvent(e);
    return new Promise(resolve => {
      setTimeout(() => {
        setTimeout(() => {
          setTimeout(() => {
            setTimeout(() => {
              setTimeout(() => {
                resolve();
              });
            });
          });
        });
      });
    });
  };

  const clickSubmitAddItemButton = () => {
    document.body.firstChild.nextSibling.firstChild.click();
    return new Promise(resolve => {
      setTimeout(() => {
        setTimeout(() => {
          setTimeout(() => {
            setTimeout(() => {
              setTimeout(() => {
                resolve();
              });
            });
          });
        });
      });
    });
  };

  beforeEach(done => {
    renderApp(<App />, document.body);
    setTimeout(() => {
      setTimeout(() => {
        done();
      });
    });
  });

  afterEach(() => {
    while(document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('should render the basic list', () => {
    expect(document.body.innerHTML).toEqual('<div>No Items Yet</div><button type=\"button\">Add Item</button>');
  });

  it('should rerender the list when the add item button is clicked', done => {
    clickAddItemButton().then(() => {
      expect(document.body.innerHTML).toEqual('<input type=\"text\"><div><button type=\"button\">Submit</button><button type=\"button\">Close</button></div>');
      done();
    });
  });

  it('should render this list and cancel back to the original view', done => {
    clickAddItemButton().then(() => {
      expect(document.body.innerHTML).toEqual('<input type=\"text\"><div><button type=\"button\">Submit</button><button type=\"button\">Close</button></div>');
      clickCancelAddItemButton().then(() => {
        expect(document.body.innerHTML).toEqual('<div>No Items Yet</div><button type=\"button\">Add Item</button>');
        done();
      });
    });
  });

  it('should add items to the list', done => {
    clickAddItemButton().then(() => {
      expect(document.body.innerHTML).toEqual('<input type=\"text\"><div><button type=\"button\">Submit</button><button type=\"button\">Close</button></div>');
      inputAddItem().then(() => {
        expect(document.body.firstChild.value).toEqual('m');
        clickSubmitAddItemButton().then(() => {
          expect(document.body.innerHTML).toEqual('<div><ul><li><span>m</span><button type=\"button\">Complete</button><button type=\"button\">Delete</button></li></ul></div><button type=\"button\">Add Item</button>');
          expect(document.body.firstChild.firstChild.firstChild.innerHTML).toEqual('<span>m</span><button type=\"button\">Complete</button><button type=\"button\">Delete</button>');
          done();
          clickAddItemButton().then(() => {
            expect(document.body.innerHTML).toEqual('<input type=\"text\"><div><button type=\"button\">Submit</button><button type=\"button\">Close</button></div>');
            done();
          });
        });
      });
    });
  });
});