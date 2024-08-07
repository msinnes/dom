// TODO: this should not have to be anchored to the top.
import { render } from '..';

import * as Dom from '@msinnes/dom';


describe('render.e2e', () => {
  it('should render undefined to the dom', () => {
    const screen = render(undefined);
    expect(screen.container.innerHTML).toEqual('');
  });

  it('should render null to the dom', () => {
    const screen = render(null);
    expect(screen.container.innerHTML).toEqual('');
  });

  it('should render an empty string to the dom', () => {
    const screen = render('');
    expect(screen.container.innerHTML).toEqual('');
  });

  it('should render an empty array to the dom', () => {
    const screen = render([]);
    expect(screen.container.innerHTML).toEqual('');
  });

  it('should render a string to the dom', () => {
    const screen = render('text');
    expect(screen.container.innerHTML).toEqual('text');
  });

  it('should render an element to the dom', () => {
    const screen = render(Dom.createElement('div'));
    expect(screen.container.innerHTML).toEqual('<div></div>');
  });

  it('should render a function component to the dom', () => {
    const App = () => 'text';
    const screen = render(Dom.createElement(App));
    expect(screen.container.innerHTML).toEqual('text');
  });

  it('should render a class component to the dom', () => {
    class App extends Dom.Component {
      render() {
        return 'text';
      }
    }
    const screen = render(Dom.createElement(App));
    expect(screen.container.innerHTML).toEqual('text');
  });

  it('should render an array of elements to the dom', () => {
    const screen = render([
      Dom.createElement('div', {}, ['text 1']),
      Dom.createElement('div', {}, ['text 2']),
    ]);
    expect(screen.container.innerHTML).toEqual('<div>text 1</div><div>text 2</div>');
  });

  it('should render an array of function elements to the dom', () => {
    const Comp1 = () => Dom.createElement('div', {}, ['text 1']);
    const Comp2 = () => Dom.createElement('div', {}, ['text 2']);
    const screen = render([
      Dom.createElement(Comp1),
      Dom.createElement(Comp2),
    ]);
    expect(screen.container.innerHTML).toEqual('<div>text 1</div><div>text 2</div>');
  });

  it('should render an array of class elements to the dom', () => {
    class Comp1 extends Dom.Component {
      render() {
        return Dom.createElement('div', {}, ['text 1']);
      }
    }
    class Comp2 extends Dom.Component {
      render() {
        return Dom.createElement('div', {}, ['text 2']);
      }
    }
    const screen = render([
      Dom.createElement(Comp1),
      Dom.createElement(Comp2),
    ]);
    expect(screen.container.innerHTML).toEqual('<div>text 1</div><div>text 2</div>');
  });

  it('should render a class component that returns a fragment', () => {
    class Comp extends Dom.Component {
      render() {
        return [
          Dom.createElement('div', {}, ['text 1']),
          Dom.createElement('div', {}, ['text 2']),
        ];
      }
    }
    const screen = render(Dom.createElement(Comp));
    expect(screen.container.innerHTML).toEqual('<div>text 1</div><div>text 2</div>');
  });

  it('should render a component that returns a null render', () => {
    const Comp = () => null;
    const screen = render(Dom.createElement(Comp));
    expect(screen.container.innerHTML).toEqual('');
  });

  it('should render a component with setState', () => {
    class Comp extends Dom.Component {
      constructor(props) {
        super(props);

        this.state = [];
      }

      renderItems() {
        return Dom.createElement('ul', {}, [this.state.map(item => ({ signature: 'li', children: [item] }))]);
      }

      click() {
        this.setState([...this.state, 'item ' + (this.state.length + 1)]);
      }

      render() {
        return [
          this.state.length ? this.renderItems() : null,
          Dom.createElement('button', { onclick: this.click.bind(this) }, ['Add Item']),
        ];
      }
    }
    const screen = render(Dom.createElement(Comp));
    expect(screen.container.innerHTML).toEqual('<button>Add Item</button>');
    screen.container.firstChild.click();
    expect(screen.container.innerHTML).toEqual('<ul><li>item 1</li></ul><button>Add Item</button>');
    screen.container.firstChild.nextSibling.click();
    expect(screen.container.innerHTML).toEqual('<ul><li>item 1</li><li>item 2</li></ul><button>Add Item</button>');
  });

  it('should render a component with a useState hook', () => {
    const HookedApp = () => {
      const [state, setState] = Dom.useState(0);
      const incrementState = () => {
        setState(state + 1);
      };
      return Dom.createElement('button', {
        onclick: incrementState,
      }, ['Click ' + state]);
    };
    const screen = render(Dom.createElement(HookedApp));
    expect(screen.container.innerHTML).toEqual('<button>Click 0</button>');
    screen.container.firstChild.click();
    expect(screen.container.innerHTML).toEqual('<button>Click 1</button>');
    screen.container.firstChild.click();
    expect(screen.container.innerHTML).toEqual('<button>Click 2</button>');
  });

  it('should render a component with useRef', () => {
    const Form = () => {
      const formRef = Dom.useRef('form');
      return Dom.createElement(formRef);
    };
    const screen = render(Dom.createElement(Form));
    expect(screen.container.innerHTML).toEqual('<form></form>');
    const formElem = screen.getByRole('form');
    expect(formElem).toBeDefined();
  });
});

describe('role queries', () => {
  describe('should support <a>', () => {
    it('should query by link if a tag has an href', () => {
      const screen = render(Dom.createElement('a', { href: 'href' }, ['link text']));
      expect(screen.getByRole('link')).toEqual(screen.container.firstChild);
    });

    it('should query by generic if a tag does not have an href', () => {
      const screen = render(Dom.createElement('a', { href: '' }, ['link text']));
      expect(screen.getAllByRole('generic')[1]).toEqual(screen.container.firstChild);
    });
  });

  it('should support <address>', () => {
    const screen = render(Dom.createElement('address'));
    expect(screen.getByRole('group')).toEqual(screen.container.firstChild);
  });

  describe('should support <area>', () => {
    it('should query by link if a tag has an href', () => {
      const screen = render(Dom.createElement('area', { href: 'href' }, ['link text']));
      expect(screen.getByRole('link')).toEqual(screen.container.firstChild);
    });

    it('should query by generic if a tag does not have an href', () => {
      const screen = render(Dom.createElement('area', { href: '' }, ['link text']));
      expect(screen.getAllByRole('generic')[1]).toEqual(screen.container.firstChild);
    });
  });

  it('should support <article>', () => {
    const screen = render(Dom.createElement('article'));
    expect(screen.getByRole('article')).toEqual(screen.container.firstChild);
  });

  it('should support <aside>', () => {
    const screen = render(Dom.createElement('aside'));
    expect(screen.getByRole('complementary')).toEqual(screen.container.firstChild);
  });

  it('should support <b>', () => {
    const screen = render(Dom.createElement('b'));
    expect(screen.getAllByRole('generic')[1]).toEqual(screen.container.firstChild);
  });

  it('should support <bdi>', () => {
    const screen = render(Dom.createElement('bdi'));
    expect(screen.getAllByRole('generic')[1]).toEqual(screen.container.firstChild);
  });

  it('should support <bdo>', () => {
    const screen = render(Dom.createElement('bdo'));
    expect(screen.getAllByRole('generic')[1]).toEqual(screen.container.firstChild);
  });

  it('should support <blockquote>', () => {
    const screen = render(Dom.createElement('blockquote', {}, ['blockquote text']));
    expect(screen.getByRole('blockquote')).toEqual(screen.container.firstChild);
  });

  it('should support <body>', () => {
    const screen = render(Dom.createElement('area', { href: '' }, ['link text']));
    expect(screen.getAllByRole('generic')[0]).toEqual(screen.container);
  });

  it('should support <button>', () => {
    const screen = render(Dom.createElement('button', {}, ['button text']));
    expect(screen.getByRole('button')).toEqual(screen.container.firstChild);
  });

  it('should support <caption>', () => {
    const screen = render(Dom.createElement('caption', {}, ['caption text']));
    expect(screen.getByRole('caption')).toEqual(screen.container.firstChild);
  });

  it('should support <code>', () => {
    const screen = render(Dom.createElement('code', {}, ['code text']));
    expect(screen.getByRole('code')).toEqual(screen.container.firstChild);
  });

  it('should support <data>', () => {
    const screen = render(Dom.createElement('data'));
    expect(screen.getAllByRole('generic')[1]).toEqual(screen.container.firstChild);
  });

  it('should support <datalist>', () => {
    const screen = render(Dom.createElement('datalist'));
    expect(screen.getByRole('listbox')).toEqual(screen.container.firstChild);
  });

  it('should support <del>', () => {
    const screen = render(Dom.createElement('del', {}, ['del text']));
    expect(screen.getByRole('deletion')).toEqual(screen.container.firstChild);
  });

  it('should support <details>', () => {
    const screen = render(Dom.createElement('details', {}, []));
    expect(screen.getByRole('group')).toEqual(screen.container.firstChild);
  });

  it('should support <dfn>', () => {
    const screen = render(Dom.createElement('dfn', {}, []));
    expect(screen.getByRole('term')).toEqual(screen.container.firstChild);
  });

  it('should support <dialog>', () => {
    const screen = render(Dom.createElement('dialog', {}, ['dialog text']));
    expect(screen.getByRole('dialog')).toEqual(screen.container.firstChild);
  });

  it('should support <div>', () => {
    const screen = render(Dom.createElement('div'));
    expect(screen.getAllByRole('generic')[1]).toEqual(screen.container.firstChild);
  });

  it('should support <em>', () => {
    const screen = render(Dom.createElement('em', {}, ['em text']));
    expect(screen.getByRole('emphasis')).toEqual(screen.container.firstChild);
  });

  it('should support <fieldset>', () => {
    const screen = render(Dom.createElement('fieldset'));
    expect(screen.getByRole('group')).toEqual(screen.container.firstChild);
  });

  it('should support <figure>', () => {
    const screen = render(Dom.createElement('figure'));
    expect(screen.getByRole('figure')).toEqual(screen.container.firstChild);
  });

  describe('should support <footer>', () => {
    it('should query by generic if footer is a child of article, aside, main, nav or section element', () => {
      let screen = render(Dom.createElement('article', {}, [Dom.createElement('footer')]));
      expect(screen.getAllByRole('generic')[1]).toEqual(screen.container.firstChild.firstChild);
      screen = render(Dom.createElement('aside', {}, [Dom.createElement('footer')]));
      expect(screen.getAllByRole('generic')[1]).toEqual(screen.container.firstChild.firstChild);
      screen = render(Dom.createElement('main', {}, [Dom.createElement('footer')]));
      expect(screen.getAllByRole('generic')[1]).toEqual(screen.container.firstChild.firstChild);
      screen = render(Dom.createElement('nav', {}, [Dom.createElement('footer')]));
      expect(screen.getAllByRole('generic')[1]).toEqual(screen.container.firstChild.firstChild);
      screen = render(Dom.createElement('section', {}, [Dom.createElement('footer')]));
      expect(screen.getAllByRole('generic')[2]).toEqual(screen.container.firstChild.firstChild);
    });

    it('should query by generic if footer is a child of an elment with article, complementary, main, navigation, or region role', () => {
      let screen = render(Dom.createElement('div', { role: 'article' }, [Dom.createElement('footer')]));
      expect(screen.getAllByRole('generic')[1]).toEqual(screen.container.firstChild.firstChild);
      screen = render(Dom.createElement('div', { role: 'complementary' }, [Dom.createElement('footer')]));
      expect(screen.getAllByRole('generic')[1]).toEqual(screen.container.firstChild.firstChild);
      screen = render(Dom.createElement('div', { role: 'main' }, [Dom.createElement('footer')]));
      expect(screen.getAllByRole('generic')[1]).toEqual(screen.container.firstChild.firstChild);
      screen = render(Dom.createElement('div', { role: 'navigation' }, [Dom.createElement('footer')]));
      expect(screen.getAllByRole('generic')[1]).toEqual(screen.container.firstChild.firstChild);
      screen = render(Dom.createElement('div', { role: 'region' }, [Dom.createElement('footer')]));
      expect(screen.getAllByRole('generic')[1]).toEqual(screen.container.firstChild.firstChild);
    });

    it('should query by contentinfo by default', () => {
      const screen = render(Dom.createElement('footer'));
      expect(screen.getByRole('contentinfo')).toEqual(screen.container.firstChild);
    });
  });

  it('should support <form>', () => {
    const screen = render(Dom.createElement('form'));
    expect(screen.getByRole('form')).toEqual(screen.container.firstChild);
  });

  it('should support <h1>', () => {
    const screen = render(Dom.createElement('h1', {}, ['heading text']));
    expect(screen.getByRole('heading')).toEqual(screen.container.firstChild);
  });

  it('should support <h2>', () => {
    const screen = render(Dom.createElement('h2', {}, ['heading text']));
    expect(screen.getByRole('heading')).toEqual(screen.container.firstChild);
  });

  it('should support <h3>', () => {
    const screen = render(Dom.createElement('h3', {}, ['heading text']));
    expect(screen.getByRole('heading')).toEqual(screen.container.firstChild);
  });

  it('should support <h4>', () => {
    const screen = render(Dom.createElement('h4', {}, ['heading text']));
    expect(screen.getByRole('heading')).toEqual(screen.container.firstChild);
  });

  it('should support <h5>', () => {
    const screen = render(Dom.createElement('h5', {}, ['heading text']));
    expect(screen.getByRole('heading')).toEqual(screen.container.firstChild);
  });

  it('should support <h6>', () => {
    const screen = render(Dom.createElement('h6', {}, ['heading text']));
    expect(screen.getByRole('heading')).toEqual(screen.container.firstChild);
  });

  describe('should support <header>', () => {
    it('should query by generic if header is a child of article, aside, main, nav or section element', () => {
      let screen = render(Dom.createElement('article', {}, [Dom.createElement('header')]));
      expect(screen.getAllByRole('generic')[1]).toEqual(screen.container.firstChild.firstChild);
      screen = render(Dom.createElement('aside', {}, [Dom.createElement('header')]));
      expect(screen.getAllByRole('generic')[1]).toEqual(screen.container.firstChild.firstChild);
      screen = render(Dom.createElement('main', {}, [Dom.createElement('header')]));
      expect(screen.getAllByRole('generic')[1]).toEqual(screen.container.firstChild.firstChild);
      screen = render(Dom.createElement('nav', {}, [Dom.createElement('header')]));
      expect(screen.getAllByRole('generic')[1]).toEqual(screen.container.firstChild.firstChild);
      screen = render(Dom.createElement('section', {}, [Dom.createElement('header')]));
      expect(screen.getAllByRole('generic')[2]).toEqual(screen.container.firstChild.firstChild);
    });

    it('should query by generic if header is a child of an elment with article, complementary, main, navigation, or region role', () => {
      let screen = render(Dom.createElement('div', { role: 'article' }, [Dom.createElement('header')]));
      expect(screen.getAllByRole('generic')[1]).toEqual(screen.container.firstChild.firstChild);
      screen = render(Dom.createElement('div', { role: 'complementary' }, [Dom.createElement('header')]));
      expect(screen.getAllByRole('generic')[1]).toEqual(screen.container.firstChild.firstChild);
      screen = render(Dom.createElement('div', { role: 'main' }, [Dom.createElement('header')]));
      expect(screen.getAllByRole('generic')[1]).toEqual(screen.container.firstChild.firstChild);
      screen = render(Dom.createElement('div', { role: 'navigation' }, [Dom.createElement('header')]));
      expect(screen.getAllByRole('generic')[1]).toEqual(screen.container.firstChild.firstChild);
      screen = render(Dom.createElement('div', { role: 'region' }, [Dom.createElement('header')]));
      expect(screen.getAllByRole('generic')[1]).toEqual(screen.container.firstChild.firstChild);
    });

    it('should query by contentinfo by default', () => {
      const screen = render(Dom.createElement('header'));
      expect(screen.getByRole('contentinfo')).toEqual(screen.container.firstChild);
    });
  });

  it('should support <hgroup>', () => {
    const screen = render(Dom.createElement('hgroup'));
    expect(screen.getByRole('group')).toEqual(screen.container.firstChild);
  });

  it('should support <hr>', () => {
    const screen = render(Dom.createElement('hr'));
    expect(screen.getByRole('separator')).toEqual(screen.container.firstChild);
  });

  // This query will not be supported, the document, head, and body will be exposed on scope.
  // it('should support <html>', () => {
  //   expect(TagToRoleMap.html).toEqual('document');
  // });

  it('should support <i>', () => {
    const screen = render(Dom.createElement('i', {}, ['italic text']));
    expect(screen.getAllByRole('generic')[1]).toBe(screen.container.firstChild);
  });

  describe('should support <img>', () => {
    it('should query on img if image has alt text', () => {
      const screen = render(Dom.createElement('img', { alt: 'text' }));
      expect(screen.getByRole('img')).toBe(screen.container.firstChild);
    });

    it('should not query on presentation if image has no alt text', () => {
      const screen = render(Dom.createElement('img', { alt: '' }));
      expect(screen.getByRole('presentation')).toBe(screen.container.firstChild);
    });
  });

  describe('should support <input>', () => {
    it('should query on button when input type is button', () => {
      const screen = render(Dom.createElement('input', { type: 'button' }, ['button text']));
      expect(screen.getByRole('button')).toEqual(screen.container.firstChild);
    });

    it('should query on checkbox if input type is checkbox', () => {
      const screen = render(Dom.createElement('input', { type: 'checkbox' }));
      expect(screen.getByRole('checkbox')).toEqual(screen.container.firstChild);
    });

    it('should query on textbox when input type is email and list attribute is undefined', () => {
      let screen = render(Dom.createElement('input', { type: 'email' }));
      expect(screen.getByRole('textbox')).toEqual(screen.container.firstChild);
      screen = render([
        Dom.createElement('input', { type: 'email', list: 'datalist' }),
        Dom.createElement('datalist', { id: 'datalist' }),
      ]);
      expect(screen.queryAllByRole('textbox').length).toEqual(0);
      expect(screen.getByRole('combobox')).toEqual(screen.container.firstChild);
    });

    it('should query on button when input type is image', () => {
      const screen = render(Dom.createElement('input', { type: 'image' }));
      expect(screen.getByRole('button')).toEqual(screen.container.firstChild);
    });

    it('should query on spinbutton when input type is number', () => {
      const screen = render(Dom.createElement('input', { type: 'number' }));
      expect(screen.getByRole('spinbutton')).toEqual(screen.container.firstChild);
    });

    it('should query on radio when input type is raio', () => {
      const screen = render(Dom.createElement('input', { type: 'radio' }));
      expect(screen.getByRole('radio')).toEqual(screen.container.firstChild);
    });

    it('should query on slider when input type is range', () => {
      const screen = render(Dom.createElement('input', { type: 'range' }));
      expect(screen.getByRole('slider')).toEqual(screen.container.firstChild);
    });

    it('should query on button when input type is reset', () => {
      const screen = render(Dom.createElement('input', { type: 'reset' }));
      expect(screen.getByRole('button')).toEqual(screen.container.firstChild);
    });

    it('should query on searchbox when input type is search and list attribute is undefined', () => {
      let screen = render(Dom.createElement('input', { type: 'search' }));
      expect(screen.getByRole('searchbox')).toEqual(screen.container.firstChild);
      screen = render([
        Dom.createElement('input', { type: 'search', list: 'datalist' }),
        Dom.createElement('datalist', { id: 'datalist' }),
      ]);
      expect(screen.queryAllByRole('searchbox').length).toEqual(0);
      expect(screen.getByRole('combobox')).toEqual(screen.container.firstChild);
    });

    it('should query on button when input type is submit', () => {
      const screen = render(Dom.createElement('input', { type: 'submit' }));
      expect(screen.getByRole('button')).toEqual(screen.container.firstChild);
    });

    it('should query on textbox when input type is tel and list attribute is undefined', () => {
      let screen = render(Dom.createElement('input', { type: 'tel' }));
      expect(screen.getByRole('textbox')).toEqual(screen.container.firstChild);
      screen = render([
        Dom.createElement('input', { type: 'tel', list: 'datalist' }),
        Dom.createElement('datalist', { id: 'datalist' }),
      ]);
      expect(screen.queryAllByRole('textbox').length).toEqual(0);
      expect(screen.getByRole('combobox')).toEqual(screen.container.firstChild);
    });

    it('should query on textbox when input type is text and list attribute is undefined', () => {
      let screen = render(Dom.createElement('input', { type: 'textbox' }));
      expect(screen.getByRole('textbox')).toEqual(screen.container.firstChild);
      screen = render([
        Dom.createElement('input', { type: 'textbox', list: 'datalist' }),
        Dom.createElement('datalist', { id: 'datalist' }),
      ]);
      expect(screen.queryAllByRole('textbox').length).toEqual(0);
      expect(screen.getByRole('combobox')).toEqual(screen.container.firstChild);
    });

    it('should query on textbox when input type is url and list attribute is undefined', () => {
      let screen = render(Dom.createElement('input', { type: 'url' }));
      expect(screen.getByRole('textbox')).toEqual(screen.container.firstChild);
      screen = render([
        Dom.createElement('input', { type: 'url', list: 'datalist' }),
        Dom.createElement('datalist', { id: 'datalist' }),
      ]);
      expect(screen.queryAllByRole('textbox').length).toEqual(0);
      expect(screen.getByRole('combobox')).toEqual(screen.container.firstChild);
    });
  });

  it('should support <ins>', () => {
    const screen = render(Dom.createElement('ins'));
    expect(screen.getByRole('insertion')).toEqual(screen.container.firstChild);
  });

  describe('should support <li>', () => {
    it('should query on generic if li is not a child of ul, ol, or menu', () => {
      const screen = render(Dom.createElement('li', {}, ['li text']));
      expect(screen.getAllByRole('generic')[1]).toEqual(screen.container.firstChild);
    });

    it('should query on listitem if li is a child of ul', () => {
      const screen = render(Dom.createElement('ul', {}, [
        Dom.createElement('li', {}, ['li text']),
      ]));
      expect(screen.getByRole('listitem')).toEqual(screen.container.firstChild.firstChild);
    });

    it('should query on listitem if li is a child of ol', () => {
      const screen = render(Dom.createElement('ol', {}, [
        Dom.createElement('li', {}, ['li text']),
      ]));
      expect(screen.getByRole('listitem')).toEqual(screen.container.firstChild.firstChild);
    });

    it('should query on listitem if li is a child of menu', () => {
      const screen = render(Dom.createElement('menu', {}, [
        Dom.createElement('li', {}, ['li text']),
      ]));
      expect(screen.getByRole('listitem')).toEqual(screen.container.firstChild.firstChild);
    });
  });

  it('should support <main>', () => {
    const screen = render(Dom.createElement('main'));
    expect(screen.getByRole('main')).toEqual(screen.container.firstChild);
  });

  it('should support <math>', () => {
    const screen = render(Dom.createElement('math'));
    expect(screen.getByRole('math')).toEqual(screen.container.firstChild);
  });

  it('should support <menu>', () => {
    const screen = render(Dom.createElement('menu'));
    expect(screen.getByRole('list')).toEqual(screen.container.firstChild);
  });

  it('should support <meter>', () => {
    const screen = render(Dom.createElement('meter'));
    expect(screen.getByRole('meter')).toEqual(screen.container.firstChild);
  });

  it('should support <nav>', () => {
    const screen = render(Dom.createElement('nav'));
    expect(screen.getByRole('navigation')).toEqual(screen.container.firstChild);
  });

  it('should support <ol>', () => {
    const screen = render(Dom.createElement('ol'));
    expect(screen.getByRole('list')).toEqual(screen.container.firstChild);
  });

  it('should support <optgroup>', () => {
    const screen = render(Dom.createElement('optgroup'));
    expect(screen.getByRole('group')).toEqual(screen.container.firstChild);
  });

  describe('should support <option>', () => {
    it('should query on option if elem is a child of parent with list role (ol, ul, menu)', () => {
      let screen = render(Dom.createElement('ol', {}, [
        Dom.createElement('option'),
      ]));
      expect(screen.getByRole('option')).toBe(screen.container.firstChild.firstChild);
      screen = render(Dom.createElement('ul', {}, [
        Dom.createElement('option'),
      ]));
      expect(screen.getByRole('option')).toBe(screen.container.firstChild.firstChild);
      screen = render(Dom.createElement('menu', {}, [
        Dom.createElement('option'),
      ]));
      expect(screen.getByRole('option')).toBe(screen.container.firstChild.firstChild);
    });

    it('should query on option if the option is a child of select', () => {
      const screen = render(Dom.createElement('select', {}, [
        Dom.createElement('option'),
      ]));
      expect(screen.getByRole('option')).toBe(screen.container.firstChild.firstChild);
    });

    it('should query on option if the option is a child of datalist', () => {
      const screen = render(Dom.createElement('datalist', {}, [
        Dom.createElement('option'),
      ]));
      expect(screen.getByRole('option')).toBe(screen.container.firstChild.firstChild);
    });
  });

  it('should support <output>', () => {
    const screen = render(Dom.createElement('output'));
    expect(screen.getByRole('status')).toBe(screen.container.firstChild);
  });

  it('should support <p>', () => {
    const screen = render(Dom.createElement('p', {}, ['p text']));
    expect(screen.getByRole('paragraph')).toBe(screen.container.firstChild);
  });

  it('should support <pre>', () => {
    const screen = render(Dom.createElement('pre'));
    expect(screen.getAllByRole('generic')[1]).toBe(screen.container.firstChild);
  });

  it('should support <progress>', () => {
    const screen = render(Dom.createElement('progress'));
    expect(screen.getByRole('progressbar')).toBe(screen.container.firstChild);
  });

  it('should support <q>', () => {
    const screen = render(Dom.createElement('q'));
    expect(screen.getAllByRole('generic')[1]).toBe(screen.container.firstChild);
  });

  it('should support <s>', () => {
    const screen = render(Dom.createElement('s'));
    expect(screen.getByRole('deletion')).toBe(screen.container.firstChild);
  });

  it('should support <samp>', () => {
    const screen = render(Dom.createElement('samp'));
    expect(screen.getAllByRole('generic')[1]).toBe(screen.container.firstChild);
  });

  it('should support <search>', () => {
    const screen = render(Dom.createElement('search'));
    expect(screen.getByRole('search')).toBe(screen.container.firstChild);
  });

  describe('should support <section>', () => {
    it('should query on region if the section has an accessible name', () => {
      const screen = render(Dom.createElement('section', { name: 'name' }));
      expect(screen.getByRole('region')).toBe(screen.container.firstChild);
    });

    it('should query on generic if there is no accessible name', () => {
      let screen = render(Dom.createElement('section'));
      expect(screen.getAllByRole('generic')[1]).toBe(screen.container.firstChild);
      screen = render(Dom.createElement('section', { name: '' }));
      expect(screen.getAllByRole('generic')[1]).toBe(screen.container.firstChild);
    });
  });

  describe('should support <select>', () => {
    it('should query on combobox if element has no multiple attr or size is no greater than 1', () => {
      let screen = render(Dom.createElement('select'));
      expect(screen.getByRole('combobox')).toBe(screen.container.firstChild);
      screen = render(Dom.createElement('select', { size: 1 }));
      expect(screen.getByRole('combobox')).toBe(screen.container.firstChild);
    });

    it('should query on listbox if element has multiple attr or size is greater than 1', () => {
      let screen = render(Dom.createElement('select', { multiple: true }));
      expect(screen.getByRole('listbox')).toBe(screen.container.firstChild);
      screen = render(Dom.createElement('select', { size: 2 }));
      expect(screen.getByRole('listbox')).toBe(screen.container.firstChild);
    });
  });

  it('should support <small>', () => {
    const screen = render(Dom.createElement('small'));
    expect(screen.getAllByRole('generic')[1]).toBe(screen.container.firstChild);
  });

  it('should support <span>', () => {
    const screen = render(Dom.createElement('span'));
    expect(screen.getAllByRole('generic')[1]).toBe(screen.container.firstChild);
  });

  it('should support <strong>', () => {
    const screen = render(Dom.createElement('strong'));
    expect(screen.getByRole('strong')).toBe(screen.container.firstChild);
  });

  it('should support <sub>', () => {
    const screen = render(Dom.createElement('sub'));
    expect(screen.getByRole('subscript')).toBe(screen.container.firstChild);
  });

  it('should support <sup>', () => {
    const screen = render(Dom.createElement('sup'));
    expect(screen.getByRole('superscript')).toBe(screen.container.firstChild);
  });

  it('should support <svg>', () => {
    const screen = render(Dom.createElement('svg'));
    expect(screen.getByRole('graphics-document')).toBe(screen.container.firstChild);
  });

  it('should support <table>', () => {
    const screen = render(Dom.createElement('table'));
    expect(screen.getByRole('table')).toBe(screen.container.firstChild);
  });

  it('should support <tbody>', () => {
    const screen = render(Dom.createElement('tbody'));
    expect(screen.getByRole('rowgroup')).toBe(screen.container.firstChild);
  });

  describe('should support <td>', () => {
    it('should query on cell if child of table with table role', () => {
      const screen = render(Dom.createElement('table', {}, [
        Dom.createElement('tr', {}, [
          Dom.createElement('td', {}, ['td text']),
        ]),
      ]));
      expect(screen.getByRole('cell')).toBe(screen.container.firstChild.firstChild.firstChild);
    });

    it('should query on gridcell if element is descendant of table with grid or treegrid role', () => {
      let screen = render(Dom.createElement('table', { role: 'grid' }, [
        Dom.createElement('tr', {}, [
          Dom.createElement('td', {}, ['td text']),
        ]),
      ]));
      expect(screen.getByRole('gridcell')).toBe(screen.container.firstChild.firstChild.firstChild);
      screen = render(Dom.createElement('table', { role: 'treegrid' }, [
        Dom.createElement('tr', {}, [
          Dom.createElement('td', {}, ['td text']),
        ]),
      ]));
    });

    it('should not query on any role if table does not have table, grid, or gridcell role', () => {
      const screen = render(Dom.createElement('table', { role: 'not a table' }, [
        Dom.createElement('tr', {}, [
          Dom.createElement('td', {}, ['td text']),
        ]),
      ]));
      expect(screen.queryAllByRole('cell').length).toEqual(0);
      expect(screen.queryAllByRole('gridcell').length).toEqual(0);
    });
  });

  it('should support <textarea>', () => {
    const screen = render(Dom.createElement('textarea'));
    expect(screen.getByRole('textbox')).toBe(screen.container.firstChild);
  });

  it('should support <tfoot>', () => {
    const screen = render(Dom.createElement('tfoot'));
    expect(screen.getByRole('rowgroup')).toBe(screen.container.firstChild);
  });

  // // TODO: role calculation of th prop should include columnheader and rowheader
  describe('should support <th>', () => {
    it('should return cell if child of table with table role', () => {
      const screen = render(Dom.createElement('table', {}, [
        Dom.createElement('tr', {}, [
          Dom.createElement('th', {}, ['th text']),
        ]),
      ]));
      expect(screen.getByRole('cell')).toBe(screen.container.firstChild.firstChild.firstChild);
    });

    it('should return gridcell if element is descendant of table with grid or treegrid role', () => {
      let screen = render(Dom.createElement('table', { role: 'grid' }, [
        Dom.createElement('tr', {}, [
          Dom.createElement('th', {}, ['th text']),
        ]),
      ]));
      expect(screen.getByRole('gridcell')).toBe(screen.container.firstChild.firstChild.firstChild);
      screen = render(Dom.createElement('table', { role: 'treegrid' }, [
        Dom.createElement('tr', {}, [
          Dom.createElement('th', {}, ['th text']),
        ]),
      ]));
    });

    it('should not query on any role if table does not have table, grid, or gridcell role', () => {
      const screen = render(Dom.createElement('table', { role: 'not a table' }, [
        Dom.createElement('tr', {}, [
          Dom.createElement('th', {}, ['th text']),
        ]),
      ]));
      expect(screen.queryAllByRole('cell').length).toEqual(0);
      expect(screen.queryAllByRole('gridcell').length).toEqual(0);
    });
  });

  it('should support <thead>', () => {
    const screen = render(Dom.createElement('thead'));
    expect(screen.getByRole('rowgroup')).toBe(screen.container.firstChild);
  });

  it('should support <time>', () => {
    const screen = render(Dom.createElement('time'));
    expect(screen.getByRole('time')).toBe(screen.container.firstChild);
  });

  it('should support <tr>', () => {
    const screen = render(Dom.createElement('tr'));
    expect(screen.getByRole('row')).toBe(screen.container.firstChild);
  });

  it('should support <u>', () => {
    const screen = render(Dom.createElement('u'));
    expect(screen.getAllByRole('generic')[1]).toBe(screen.container.firstChild);
  });

  it('should support <ul>', () => {
    const screen = render(Dom.createElement('ul'));
    expect(screen.getByRole('list')).toBe(screen.container.firstChild);
  });
});

describe('text queries', () => {
  let screen;
  beforeEach(() => {
    screen = render(Dom.createElement('div', {}, [
      Dom.createElement('span', {}, ['duplicate']),
      Dom.createElement('span', {}, ['query']),
      Dom.createElement('span', {}, ['duplicate']),
    ]));
  });

  describe('getByText', () => {
    it('should get a single element if one is found', () => {
      const elem = screen.getByText('query');
      expect(elem).toBe(screen.container.firstChild.firstChild.nextSibling);
    });

    it('should throw an error if no results are found', () => {
      expect(() => {
        screen.getByText();
      }).toThrow('getByText did not find any results');
    });

    it('should throw an error if more than one result is found', () => {
      expect(() => {
        screen.getByText('duplicate');
      }).toThrow('getByText found more than one result');
    });
  });

  describe('getAllByText', () => {
    it('should return an array of found elements', () => {
      let elems = screen.getAllByText('duplicate');
      expect(elems.length).toEqual(2);
      expect(elems[0]).toBe(screen.container.firstChild.firstChild);
      expect(elems[1]).toBe(screen.container.firstChild.firstChild.nextSibling.nextSibling);
      elems = screen.getAllByText('query');
      expect(elems[0]).toBe(screen.container.firstChild.firstChild.nextSibling);
    });

    it('should throw an error if no results are found', () => {
      expect(() => {
        screen.getAllByText();
      }).toThrow('getAllByText did not find any results');
    });
  });

  describe('queryAllByText', () => {
    it('should return an array of found elements', () => {
      let elems = screen.queryAllByText('duplicate');
      expect(elems.length).toEqual(2);
      expect(elems[0]).toBe(screen.container.firstChild.firstChild);
      expect(elems[1]).toBe(screen.container.firstChild.firstChild.nextSibling.nextSibling);
      elems = screen.queryAllByText('query');
      expect(elems[0]).toBe(screen.container.firstChild.firstChild.nextSibling);
    });

    it('should return an empty array if no results are found', () => {
      const results = screen.queryAllByText();
      expect(results.length).toEqual(0);
    });
  });
});

describe('timers', () => {
  describe('timeouts', () => {
    it('should run an immediate timer', () => {
      const App = () => {
        const [text, setText] = Dom.useState('default text');
        Dom.useEffect(() => {
          setTimeout(() => {
            setText('async text');
          });
        }, []);
        return text;
      };
      const screen = render(Dom.createElement(App));
      expect(screen.container.innerHTML).toEqual('async text');
    });

    it('should clear nested setTimeout calls', () => {
      const App = () => {
        const [text, setText] = Dom.useState('default text');
        Dom.useEffect(() => {
          setTimeout(() => {
            setTimeout(() => {
              setTimeout(() => {
                setText('async text');
              });
            });
          });
        }, []);
        return text;
      };
      const screen = render(Dom.createElement(App));
      expect(screen.container.innerHTML).toEqual('async text');
    });

    it('should process a sequence of timeouts utilizing the play functionality', () => {
      const App = () => {
        const [text, setText] = Dom.useState('default text');
        Dom.useEffect(() => {
          setTimeout(() => {
            setText('async text 1');
            setTimeout(() => {
              setText('async text 2');
              setTimeout(() => {
                setText('async text 3');
              }, 1);
            }, 1);
          }, 1);
        }, []);
        return text;
      };
      const screen = render(Dom.createElement(App));
      expect(screen.container.innerHTML).toEqual('default text');
      screen.time.play();
      expect(screen.container.innerHTML).toEqual('async text 1');
      screen.time.play();
      expect(screen.container.innerHTML).toEqual('async text 2');
      screen.time.play();
      expect(screen.container.innerHTML).toEqual('async text 3');
    });

    it('should process a sequence of timeouts utilizing the play functionality with parameters passed', () => {
      const App = () => {
        const [text, setText] = Dom.useState('default text');
        Dom.useEffect(() => {
          setTimeout(() => {
            setText('async text 1');
            setTimeout(() => {
              setText('async text 2');
              setTimeout(() => {
                setText('async text 3');
              }, 10);
            }, 10);
          }, 10);
        }, []);
        return text;
      };
      const screen = render(Dom.createElement(App));
      expect(screen.container.innerHTML).toEqual('default text');
      screen.time.play();
      expect(screen.container.innerHTML).toEqual('default text');
      screen.time.play(10);
      expect(screen.container.innerHTML).toEqual('async text 1');
      screen.time.play(30);
      expect(screen.container.innerHTML).toEqual('async text 3');
    });

    it('should throw an error if an infinite loop occurs', () => {
      const App = () => {
        const [text, setText] = Dom.useState('default text');
        setTimeout(() => {
          setText('async text');
        });
        return text;
      };
      expect(() => {
        render(Dom.createElement(App));
      }).toThrow('ImplementationError: Maximum call depth exceeded for Asynchronous Processing.');
    });

    it('should throw the correct error if a hook is used asynchronously', () => {
      const App = () => {
        let text = 'text';
        setTimeout(() => {
          Dom.useEffect(() => {
            text = 'new text';
          });
        });
        return text;
      };
      expect(() => {
        render(Dom.createElement(App));
      }).toThrow('InternalError: There is no active context on the controller');
    });

    it('should not run immediate timers if the app configuration is overridden', () => {
      const App = () => {
        const [text, setText] = Dom.useState('default text');
        Dom.useEffect(() => {
          setTimeout(() => {
            setText('async text');
          });
        }, []);
        return text;
      };
      const screen = render(Dom.createElement(App), { digestExpiredTimers: false });
      expect(screen.container.innerHTML).toEqual('default text');
    });

    it('should not execute a collection of timers when play is called if the app configuration is overridden', () => {
      const App = () => {
        const [text, setText] = Dom.useState('default text');
        Dom.useEffect(() => {
          setTimeout(() => {
            setText('async text 1');
            setTimeout(() => {
              setText('async text 2');
              setTimeout(() => {
                setText('async text 3');
              }, 1);
            }, 1);
          }, 1);
        }, []);
        return text;
      };
      const screen = render(Dom.createElement(App), { digestExpiredTimers: false });
      expect(screen.container.innerHTML).toEqual('default text');
      screen.time.play();
      expect(screen.container.innerHTML).toEqual('default text');
      screen.time.play();
      expect(screen.container.innerHTML).toEqual('default text');
    });

    it('should allow the user to process expired timers one by one', () => {
      const App = () => {
        const [text, setText] = Dom.useState('default text');
        Dom.useEffect(() => {
          setTimeout(() => {
            setText('async text 1');
            setTimeout(() => {
              setText('async text 2');
              setTimeout(() => {
                setText('async text 3');
              }, 1);
            }, 1);
          }, 1);
        }, []);
        return text;
      };
      const screen = render(Dom.createElement(App), { digestExpiredTimers: false });
      expect(screen.container.innerHTML).toEqual('default text');
      screen.time.play(1);
      expect(screen.container.innerHTML).toEqual('default text');
      screen.time.next();
      expect(screen.container.innerHTML).toEqual('async text 1');
      screen.time.next();
      expect(screen.container.innerHTML).toEqual('async text 1');
      screen.time.play(1);
      screen.time.next();
      expect(screen.container.innerHTML).toEqual('async text 2');
      screen.time.play(1);
      screen.time.next();
      expect(screen.container.innerHTML).toEqual('async text 3');
    });

    it('should stack parallel timers and run them one by one', () => {
      const App = () => {
        const [text, setText] = Dom.useState('default text');
        Dom.useEffect(() => {
          setTimeout(() => {
            setText('async text 1');
          }, 2);
        }, []);
        Dom.useEffect(() => {
          setTimeout(() => {
            setText('async text 2');
          });
        }, []);
        Dom.useEffect(() => {
          setTimeout(() => {
            setText('async text 3');
          }, 1);
        }, []);
        return text;
      };
      const screen = render(Dom.createElement(App), { digestExpiredTimers: false });
      expect(screen.container.innerHTML).toEqual('default text');
      screen.time.play(2);
      expect(screen.container.innerHTML).toEqual('default text');
      screen.time.next();
      expect(screen.container.innerHTML).toEqual('async text 2');
      screen.time.next();
      expect(screen.container.innerHTML).toEqual('async text 3');
      screen.time.next();
      expect(screen.container.innerHTML).toEqual('async text 1');
    });

    it('should allow the user to process expired timers by a batch', () => {
      const App = () => {
        const [text, setText] = Dom.useState('default text');
        Dom.useEffect(() => {
          setTimeout(() => {
            setText('async text 1');
            setTimeout(() => {
              setText('async text 2');
              setTimeout(() => {
                setText('async text 3');
              }, 1);
            }, 1);
          }, 1);
        }, []);
        return text;
      };
      const screen = render(Dom.createElement(App), { digestExpiredTimers: false });
      expect(screen.container.innerHTML).toEqual('default text');
      screen.time.play(1);
      expect(screen.container.innerHTML).toEqual('default text');
      screen.time.run();
      expect(screen.container.innerHTML).toEqual('async text 1');
      screen.time.run();
      expect(screen.container.innerHTML).toEqual('async text 1');
      screen.time.play(1);
      screen.time.run();
      expect(screen.container.innerHTML).toEqual('async text 2');
      screen.time.play(1);
      screen.time.run();
      expect(screen.container.innerHTML).toEqual('async text 3');
    });

    it('should stack parallel timers and run them as a batch', () => {
      const App = () => {
        const [text, setText] = Dom.useState('default text');
        Dom.useEffect(() => {
          setTimeout(() => {
            setText('async text 1');
          }, 2);
        }, []);
        Dom.useEffect(() => {
          setTimeout(() => {
            setText('async text 2');
          });
        }, []);
        Dom.useEffect(() => {
          setTimeout(() => {
            setText('async text 3');
          }, 1);
        }, []);
        return text;
      };
      const screen = render(Dom.createElement(App), { digestExpiredTimers: false });
      expect(screen.container.innerHTML).toEqual('default text');
      screen.time.play(2);
      expect(screen.container.innerHTML).toEqual('default text');
      screen.time.run();
      expect(screen.container.innerHTML).toEqual('async text 1');
    });
  });

  describe('intervals', () => {
    it('should run an immediate interval', () => {
      const App = () => {
        const [text, setText] = Dom.useState('default text');
        Dom.useEffect(() => {
          setInterval(() => {
            setText('async text');
          });
        }, []);
        return text;
      };
      const screen = render(Dom.createElement(App));
      expect(screen.container.innerHTML).toEqual('async text');
    });

    it('should run nested intervals', () => {
      const App = () => {
        const [text, setText] = Dom.useState('default text');
        Dom.useEffect(() => {
          setInterval(() => {
            setInterval(() => {
              setText('async text');
            });
          });
        }, []);
        return text;
      };
      const screen = render(Dom.createElement(App));
      expect(screen.container.innerHTML).toEqual('async text');
    });

    it('should only execute intervals once per tick', () => {
      let idx = 0;
      const App = () => {
        const [text, setText] = Dom.useState('default text');
        Dom.useEffect(() => {
          setInterval(() => {
            setText(`async text ${idx++}`);
          });
        }, []);
        return text;
      };
      const screen = render(Dom.createElement(App));
      expect(screen.container.innerHTML).toEqual('async text 0');
      screen.time.run();
      expect(screen.container.innerHTML).toEqual('async text 0');
      screen.time.play();
      expect(screen.container.innerHTML).toEqual('async text 1');
      screen.time.run();
      expect(screen.container.innerHTML).toEqual('async text 1');
    });

    it('should execute parallel intervals', () => {
      let idx1 = 0;
      let idx2 = 0;
      const App = () => {
        const [text1, setText1] = Dom.useState('default text');
        const [text2, setText2] = Dom.useState('default text');
        Dom.useEffect(() => {
          setInterval(() => {
            setText1(`async text ${idx1++}`);
          });
        }, []);

        Dom.useEffect(() => {
          setInterval(() => {
            setText2(`async text ${idx2++}`);
          }, 2);
        }, []);
        return Dom.createElement('div', {}, [
          Dom.createElement('p', {}, [text1]),
          Dom.createElement('p', {}, [text2]),
        ]);
      };
      const screen = render(Dom.createElement(App));
      expect(screen.container.innerHTML).toEqual('<div><p>async text 0</p><p>default text</p></div>');
      screen.time.play();
      expect(screen.container.innerHTML).toEqual('<div><p>async text 1</p><p>default text</p></div>');
      screen.time.play();
      expect(screen.container.innerHTML).toEqual('<div><p>async text 2</p><p>async text 0</p></div>');
      screen.time.play();
      expect(screen.container.innerHTML).toEqual('<div><p>async text 3</p><p>async text 0</p></div>');
      screen.time.play();
      expect(screen.container.innerHTML).toEqual('<div><p>async text 4</p><p>async text 1</p></div>');
    });

    it('should throw the correct error if a hook is used asynchronously', () => {
      const App = () => {
        let text = 'text';
        setInterval(() => {
          Dom.useEffect(() => {
            text = 'new text';
          });
        });
        return text;
      };
      expect(() => {
        render(Dom.createElement(App));
      }).toThrow('InternalError: There is no active context on the controller');
    });

    it('should not run immediate timers if the app configuration is overridden', () => {
      const App = () => {
        const [text, setText] = Dom.useState('default text');
        Dom.useEffect(() => {
          setInterval(() => {
            setText('async text');
          });
        }, []);
        return text;
      };
      const screen = render(Dom.createElement(App), { digestExpiredTimers: false });
      expect(screen.container.innerHTML).toEqual('default text');
    });

    it('should manually run the next timer', () => {
      const App = () => {
        const [text, setText] = Dom.useState('default text');
        Dom.useEffect(() => {
          setInterval(() => {
            setText('async text');
          });
        }, []);
        return text;
      };
      const screen = render(Dom.createElement(App), { digestExpiredTimers: false });
      expect(screen.container.innerHTML).toEqual('default text');
      screen.time.next();
      expect(screen.container.innerHTML).toEqual('async text');
    });

    it('should manually run batch timers', () => {
      const App = () => {
        const [text1, setText1] = Dom.useState('default text');
        const [text2, setText2] = Dom.useState('default text');
        Dom.useEffect(() => {
          setInterval(() => {
            setText1('async text 1');
          });
        }, []);

        Dom.useEffect(() => {
          setInterval(() => {
            setText2('async text 2');
          });
        }, []);
        return Dom.createElement('div', {}, [
          Dom.createElement('p', {}, [text1]),
          Dom.createElement('p', {}, [text2]),
        ]);
      };
      const screen = render(Dom.createElement(App), { digestExpiredTimers: false });
      expect(screen.container.innerHTML).toEqual('<div><p>default text</p><p>default text</p></div>');
      screen.time.run();
      expect(screen.container.innerHTML).toEqual('<div><p>async text 1</p><p>async text 2</p></div>');
    });

    it('should run an interval sequence manually', () => {
      const App = () => {
        const [text1, setText1] = Dom.useState('default text');
        const [text2, setText2] = Dom.useState('default text');
        Dom.useEffect(() => {
          setInterval(() => {
            setText1('async text 1');
          }, 1);
        }, []);

        Dom.useEffect(() => {
          setInterval(() => {
            setText2('async text 2');
          }, 2);
        }, []);
        return Dom.createElement('div', {}, [
          Dom.createElement('p', {}, [text1]),
          Dom.createElement('p', {}, [text2]),
        ]);
      };
      const screen = render(Dom.createElement(App), { digestExpiredTimers: false });
      expect(screen.container.innerHTML).toEqual('<div><p>default text</p><p>default text</p></div>');
      screen.time.run();
      expect(screen.container.innerHTML).toEqual('<div><p>default text</p><p>default text</p></div>');
      screen.time.tick();
      expect(screen.container.innerHTML).toEqual('<div><p>default text</p><p>default text</p></div>');
      screen.time.run();
      expect(screen.container.innerHTML).toEqual('<div><p>async text 1</p><p>default text</p></div>');
      screen.time.tick();
      screen.time.run();
      expect(screen.container.innerHTML).toEqual('<div><p>async text 1</p><p>async text 2</p></div>');
    });
  });

  describe('animationFrames', () => {
    it('should render an animationFrame', () => {
      const App = () => {
        const [text, setText] = Dom.useState('default text');
        Dom.useEffect(() => {
          requestAnimationFrame(() => {
            setText('async text');
          });
        }, []);
        return text;
      };
      const screen = render(Dom.createElement(App));
      expect(screen.container.innerHTML).toEqual('default text');
      screen.time.play(16);
      expect(screen.container.innerHTML).toEqual('async text');
    });

    it('should cancal an animationFrame', () => {
      const App = () => {
        const [frameId, setFrameId] = Dom.useState();
        const [text, setText] = Dom.useState('default text');
        Dom.useEffect(() => {
          setFrameId(requestAnimationFrame(() => {
            setText('async text');
          }));
        }, []);
        // settingFrameId will trigger a re-render, and this will clear the animationFrame request
        Dom.useEffect(() => {
          if (frameId) {
            cancelAnimationFrame(frameId);
            setFrameId();
          }
        }, [frameId]);
        return text;
      };
      const screen = render(Dom.createElement(App));
      expect(screen.container.innerHTML).toEqual('default text');
      screen.time.play(16);
      expect(screen.container.innerHTML).toEqual('default text');
    });
  });

  describe('composite', () => {
    it('should render a screen with timeouts and intervals', () => {
      const App = () => {
        const [text1, setText1] = Dom.useState('default text');
        const [text2, setText2] = Dom.useState('default text');
        Dom.useEffect(() => {
          setTimeout(() => {
            setText1('async text 1');
          });
        }, []);

        Dom.useEffect(() => {
          setInterval(() => {
            setText2('async text 2');
          });
        }, []);
        return Dom.createElement('div', {}, [
          Dom.createElement('p', {}, [text1]),
          Dom.createElement('p', {}, [text2]),
        ]);
      };
      const screen = render(Dom.createElement(App));
      expect(screen.container.innerHTML).toEqual('<div><p>async text 1</p><p>async text 2</p></div>');
    });

    it('should play a screen with timeouts and intervals', () => {
      let i = 0;
      const App = () => {
        const [text1, setText1] = Dom.useState('default text');
        const [text2, setText2] = Dom.useState('default text');
        Dom.useEffect(() => {
          setTimeout(() => {
            setText1('async text');
          }, 5);
        }, []);

        Dom.useEffect(() => {
          setInterval(() => {
            setText2(`async text ${i++}`);
          });
        }, []);
        return Dom.createElement('div', {}, [
          Dom.createElement('p', {}, [text1]),
          Dom.createElement('p', {}, [text2]),
        ]);
      };
      const screen = render(Dom.createElement(App));
      expect(screen.container.innerHTML).toEqual('<div><p>default text</p><p>async text 0</p></div>');
      screen.time.play(5);
      expect(screen.container.innerHTML).toEqual('<div><p>async text</p><p>async text 5</p></div>');
    });

    it('should play a screen with timeouts and intervals', () => {
      let i = 0;
      const App = () => {
        const [text1, setText1] = Dom.useState('default text');
        const [text2, setText2] = Dom.useState('default text');
        Dom.useEffect(() => {
          setTimeout(() => {
            setText1('async text');
          }, 5);
        }, []);

        Dom.useEffect(() => {
          setInterval(() => {
            setText2(`async text ${i++}`);
          });
        }, []);

        return Dom.createElement('div', {}, [
          Dom.createElement('p', {}, [text1]),
          Dom.createElement('p', {}, [text2]),
        ]);
      };
      const screen = render(Dom.createElement(App));
      expect(screen.container.innerHTML).toEqual('<div><p>default text</p><p>async text 0</p></div>');
      screen.time.play(5);
      expect(screen.container.innerHTML).toEqual('<div><p>async text</p><p>async text 5</p></div>');
    });

    it('should manually tick timeouts and intervals', () => {
      let i = 0;
      const App = () => {
        const [text1, setText1] = Dom.useState('default text');
        const [text2, setText2] = Dom.useState('default text');
        Dom.useEffect(() => {
          setTimeout(() => {
            setText1('async text');
          }, 5);
        }, []);

        Dom.useEffect(() => {
          setInterval(() => {
            setText2(`async text ${i++}`);
          });
        }, []);
        return Dom.createElement('div', {}, [
          Dom.createElement('p', {}, [text1]),
          Dom.createElement('p', {}, [text2]),
        ]);
      };
      const screen = render(Dom.createElement(App), { digestExpiredTimers: false });
      expect(screen.container.innerHTML).toEqual('<div><p>default text</p><p>default text</p></div>');
      screen.time.tick();
      expect(screen.container.innerHTML).toEqual('<div><p>default text</p><p>default text</p></div>');
      screen.time.next();
      expect(screen.container.innerHTML).toEqual('<div><p>default text</p><p>async text 0</p></div>');
      screen.time.tick();
      screen.time.next();
      expect(screen.container.innerHTML).toEqual('<div><p>default text</p><p>async text 1</p></div>');
      screen.time.tick();
      screen.time.next();
      expect(screen.container.innerHTML).toEqual('<div><p>default text</p><p>async text 2</p></div>');
      screen.time.tick();
      screen.time.next();
      expect(screen.container.innerHTML).toEqual('<div><p>default text</p><p>async text 3</p></div>');
      screen.time.tick();
      screen.time.next();
      expect(screen.container.innerHTML).toEqual('<div><p>default text</p><p>async text 4</p></div>');
      screen.time.next();
      expect(screen.container.innerHTML).toEqual('<div><p>async text</p><p>async text 4</p></div>');
      // Queue is exhausted. Sanity check for empty call.
      screen.time.next();
      expect(screen.container.innerHTML).toEqual('<div><p>async text</p><p>async text 4</p></div>');
    });

    it('should manually tick timeouts and intervals', () => {
      let i = 0;
      const App = () => {
        const [text1, setText1] = Dom.useState('default text');
        const [text2, setText2] = Dom.useState('default text');

        Dom.useEffect(() => {
          setTimeout(() => {
            setText1('async text');
          }, 5);
        }, []);

        Dom.useEffect(() => {
          setInterval(() => {
            setText2(`async text ${i++}`);
          });
        }, []);
        return Dom.createElement('div', {}, [
          Dom.createElement('p', {}, [text1]),
          Dom.createElement('p', {}, [text2]),
        ]);
      };
      const screen = render(Dom.createElement(App), { digestExpiredTimers: false });
      expect(screen.container.innerHTML).toEqual('<div><p>default text</p><p>default text</p></div>');
      screen.time.tick();
      screen.time.next();
      expect(screen.container.innerHTML).toEqual('<div><p>default text</p><p>async text 0</p></div>');
      screen.time.tick();
      screen.time.next();
      expect(screen.container.innerHTML).toEqual('<div><p>default text</p><p>async text 1</p></div>');
      screen.time.tick();
      screen.time.next();
      expect(screen.container.innerHTML).toEqual('<div><p>default text</p><p>async text 2</p></div>');
      screen.time.tick();
      screen.time.next();
      expect(screen.container.innerHTML).toEqual('<div><p>default text</p><p>async text 3</p></div>');
      screen.time.tick();
      screen.time.next();
      expect(screen.container.innerHTML).toEqual('<div><p>default text</p><p>async text 4</p></div>');
      screen.time.next();
      expect(screen.container.innerHTML).toEqual('<div><p>async text</p><p>async text 4</p></div>');
    });

    it('should process timers run against the window object', () => {
      const App = () => {
        const [text1, setText1] = Dom.useState('default text');
        const [text2, setText2] = Dom.useState('default text');
        Dom.useEffect(() => {
          window.setTimeout(() => {
            setText1('async text');
          });
        }, []);

        Dom.useEffect(() => {
          window.setInterval(() => {
            setText2('async text');
          });
        }, []);
        return Dom.createElement('div', {}, [
          Dom.createElement('p', {}, [text1]),
          Dom.createElement('p', {}, [text2]),
        ]);
      };
      const screen = render(Dom.createElement(App));
      expect(screen.container.innerHTML).toEqual('<div><p>async text</p><p>async text</p></div>');
    });

    it('should increment through a series of timers correctly', () => {
      const App = () => {
        const [text1, setText1] = Dom.useState('default text');
        const [text2, setText2] = Dom.useState('default text');
        Dom.useEffect(() => {
          setInterval(() => {
            setTimeout(() => {
              setText1('async text');
            });
          });
        }, []);

        Dom.useEffect(() => {
          setInterval(() => {
            setTimeout(() => {
              setText2('async text');
            }, 1);
          });
        }, []);
        return Dom.createElement('div', {}, [
          Dom.createElement('p', {}, [text1]),
          Dom.createElement('p', {}, [text2]),
        ]);
      };
      const screen = render(Dom.createElement(App), { digestExpiredTimers: false });
      expect(screen.container.innerHTML).toEqual('<div><p>default text</p><p>default text</p></div>');
      screen.time.next();
      expect(screen.container.innerHTML).toEqual('<div><p>default text</p><p>default text</p></div>');
      screen.time.next();
      expect(screen.container.innerHTML).toEqual('<div><p>async text</p><p>default text</p></div>');
      screen.time.next();
      expect(screen.container.innerHTML).toEqual('<div><p>async text</p><p>default text</p></div>');
      screen.time.next();
      expect(screen.container.innerHTML).toEqual('<div><p>async text</p><p>default text</p></div>');
      screen.time.tick();
      screen.time.next();
      expect(screen.container.innerHTML).toEqual('<div><p>async text</p><p>async text</p></div>');
      screen.time.next();
      expect(screen.container.innerHTML).toEqual('<div><p>async text</p><p>async text</p></div>');
      screen.time.next();
      expect(screen.container.innerHTML).toEqual('<div><p>async text</p><p>async text</p></div>');
      screen.time.next();
      expect(screen.container.innerHTML).toEqual('<div><p>async text</p><p>async text</p></div>');
      screen.time.next();
      expect(screen.container.innerHTML).toEqual('<div><p>async text</p><p>async text</p></div>');
      // Queue is exhausted, will make sure that no error happens when queue has run out.
      screen.time.next();
      expect(screen.container.innerHTML).toEqual('<div><p>async text</p><p>async text</p></div>');
    });
  });
});

describe('fetch', () => {
  const getName = () => fetch('url', { body: { name: 'name' } });

  const Name = () => {
    const [name, setName] = Dom.useState();
    Dom.useEffect(() => {
      if (!name) getName().then(data => {
        if (data.ok) return data.text();
      }).then(name => setName(name));
    }, []);
    return name && name.length ? name : 'no name';
  };

  const App = () => {
    return Dom.createElement(Name);
  };

  it('should process a fetch request', () => {
    const config = {
      fetch: (req, res) => {
        res.text(req.config.body.name);
        res.close();
      },
    };
    const screen = render(Dom.createElement(App), config);
    expect(screen.container.innerHTML).toEqual('name');
  });

  it('should not expose the ssr scope to the fetch request (fetch interceptors should operate in server mode)', () => {
    const config = {
      fetch: (req, res) => {
        expect(global.window).toBeUndefined();
        res.text(req.config.body.name);
        res.close();
      },
    };
    const screen = render(Dom.createElement(App), config);
    expect(screen.container.innerHTML).toEqual('name');
  });

  it('should not digest fetch calls if configuration is overriden', () => {
    const config = {
      digestFetch: false,
      fetch: (req, res) => {
        expect(global.window).toBeUndefined();
        res.text(req.config.body.name);
      },
    };
    const screen = render(Dom.createElement(App), config);
    expect(screen.container.innerHTML).toEqual('no name');
  });

  it('should execute a single fetch handler with screen.fetch.next', () => {
    const config = {
      digestFetch: false,
      fetch: (req, res) => {
        expect(global.window).toBeUndefined();
        res.text(req.config.body.name);
        res.close();
      },
    };
    const screen = render(Dom.createElement(App), config);
    expect(screen.container.innerHTML).toEqual('no name');
    screen.fetch.next();
    expect(screen.container.innerHTML).toEqual('name');
  });

  it('should execute a single fetch handler with screen.fetch.run', () => {
    const config = {
      digestFetch: false,
      fetch: (req, res) => {
        expect(global.window).toBeUndefined();
        res.text(req.config.body.name);
        res.close();
      },
    };
    const screen = render(Dom.createElement(App), config);
    expect(screen.container.innerHTML).toEqual('no name');
    screen.fetch.run();
    expect(screen.container.innerHTML).toEqual('name');
  });

  it('should execute a fetch handler, and resolve it in an asynchronous handler', done => {
    const config = {
      digestFetch: false,
      fetch: (req, res) => {
        res.text(req.config.body.name);
        setTimeout(() => {
          res.close();
          expect(screen.container.innerHTML).toEqual('name');
          done();
        });
      },
    };
    const screen = render(Dom.createElement(App), config);
    expect(screen.container.innerHTML).toEqual('no name');
    screen.fetch.run();
    expect(screen.container.innerHTML).toEqual('no name');
  });
});

describe('events', () => {
  // TODO: (testing-events) run the gambit on events, make an event service, document changes
  describe('oninput event', () => {
    let value = '';
    const oninput = event => {
      value = event.target.value;
    };
    const screen = render(Dom.createElement('input', { type: 'text', value, oninput }));
    // TODO: this is a duplicate line
    screen.createEvent('input', { cancelable: true, bubbles: true });
    screen.dispatchEvent(screen.container.firstChild, screen.createEvent('input', { cancelable: true, bubbles: true }), { value: 'a' });
    expect(value).toEqual('a');
  });
});

// TODO: (svg-update) add e2e tests for svg components
describe('svg.e2e', () => {
  it('should support <a>', () => {
    const screen = render(Dom.createElement('svg', { viewBox: '0 0 100 100', xmlns: 'http://www.w3.org/2000/svg' }, [
      Dom.createElement('a', { href: 'https://developer.mozilla.org/en-US/docs/Web/SVG/Element/circle' }, [
        Dom.createElement('circle', { cx: 50, cy: 40, r: 35 }),
      ]),
    ]));
    expect(screen.container.innerHTML).toEqual('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><a href="https://developer.mozilla.org/en-US/docs/Web/SVG/Element/circle"><circle cx="50" cy="40" r="35"></circle></a></svg>');
  });

  it('should render <animate>', () => {
    const screen = render(Dom.createElement('svg', { viewBox: '0 0 100 100', xmlns: 'http://www.w3.org/2000/svg' }, [
      Dom.createElement('rect', { width: 10, height: 10 }, [
        Dom.createElement('animate', { attributeName: 'rx', values: '0;5;0', dur: '10s', repeatCount: 'indefinite' }),
      ]),
    ]));
    expect(screen.container.innerHTML).toEqual('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="10" height="10"><animate attributeName="rx" values="0;5;0" dur="10s" repeatCount="indefinite"></animate></rect></svg>');
  });

  it('should render <animateMotion>', () => {
    const screen = render(Dom.createElement('svg', { viewBox: '0 0 200 200', xmlns: 'http://www.w3.org/2000/svg' }, [
      Dom.createElement('path', { fill: 'none', stroke: 'lightgrey', d:'M20,50 C20,-50 180,150 180,50 C180-50 20,150 20,50 z' }),
      Dom.createElement('circle', { r: 5, fill: 'red' }, [
        Dom.createElement('animateMotion', { dur: '10s', repeatCount: 'indefinite', path:'M20,50 C20,-50 180,150 180,50 C180-50 20,150 20,50 z' }),
      ]),
    ]));
    expect(screen.container.innerHTML).toEqual('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><path fill="none" stroke="lightgrey" d="M20,50 C20,-50 180,150 180,50 C180-50 20,150 20,50 z"></path><circle r="5" fill="red"><animateMotion dur="10s" repeatCount="indefinite" path="M20,50 C20,-50 180,150 180,50 C180-50 20,150 20,50 z"></animateMotion></circle></svg>');
  });

  it('should render <animateTransform>', () => {
    const screen = render(Dom.createElement('svg', { height: '120', width: '120', viewBox: '0 0 120 120', xmlns: 'http://www.w3.org/2000/svg' }, [
      Dom.createElement('polygon', { points: '60,30 90,90 30,90' }, [
        Dom.createElement('animateTransform', { attributeName: 'transform', attributeType: 'XML', type: 'rotate', from: '0 60 70', to: '360 60 70', dur: '10s', repeatCount: 'indefinite' }),
      ]),
    ]));
    expect(screen.container.innerHTML).toEqual('<svg xmlns="http://www.w3.org/2000/svg" height="120" width="120" viewBox="0 0 120 120"><polygon points="60,30 90,90 30,90"><animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 60 70" to="360 60 70" dur="10s" repeatCount="indefinite"></animateTransform></polygon></svg>');
  });

  it('should render <circle>', () => {
    const screen = render(Dom.createElement('svg', { viewBox: '0 0 100 100', xmlns: 'http://www.w3.org/2000/svg' }, [
      Dom.createElement('circle', { cx: 50, cy: 50, r: 50 }),
    ]));
    expect(screen.container.innerHTML).toEqual('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50"></circle></svg>');
  });

  it('should render <clipPath>', () => {
    const screen = render(Dom.createElement('svg', { viewBox: '0 0 100 100', xmlns: 'http://www.w3.org/2000/svg' }, [
      Dom.createElement('clipPath', { id: 'myClip' }, [
        Dom.createElement('circle', { cx: 40, cy: 35, r: 35 }),
      ]),
      Dom.createElement('path', { id: 'heart', d: 'M10,30 A20,20,0,0,1,50,30 A20,20,0,0,1,90,30 Q90,60,50,90 Q10,60,10,30 Z' }),
      Dom.createElement('use', { 'clip-path': 'url(#myClip)', href: '#heart', fill: 'red' }),
    ]));
    expect(screen.container.innerHTML).toEqual('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><clipPath id="myClip"><circle cx="40" cy="35" r="35"></circle></clipPath><path id="heart" d="M10,30 A20,20,0,0,1,50,30 A20,20,0,0,1,90,30 Q90,60,50,90 Q10,60,10,30 Z"></path><use clip-path="url(#myClip)" href="#heart" fill="red"></use></svg>');
  });

  it('should render <defs>', () => {
    const screen = render(Dom.createElement('svg', { viewBox: '0 0 10 10', xmlns: 'http://www.w3.org/2000/svg' }, [
      Dom.createElement('defs', {}, [
        Dom.createElement('circle', { id:'myCircle', cx: 0, cy: 0, r: 5 }),
        Dom.createElement('linearGradient', { id: 'myGradient', gradientTransform: 'rotate(90)' }, [
          Dom.createElement('stop', { offset: '20%', 'stop-color': 'gold' }),
          Dom.createElement('stop', { offset: '90%', 'stop-color': 'red' }),
        ]),
      ]),
      Dom.createElement('use', { x: 5, y: 5, href: '#myCircle', fill: 'url(\'#myGradient\')' }),
    ]));
    expect(screen.container.innerHTML).toEqual('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><defs><circle id="myCircle" cx="0" cy="0" r="5"></circle><linearGradient id="myGradient" gradientTransform="rotate(90)"><stop offset="20%" stop-color="gold"></stop><stop offset="90%" stop-color="red"></stop></linearGradient></defs><use x="5" y="5" href="#myCircle" fill="url(\'#myGradient\')"></use></svg>');
  });

  it('should render <desc>', () => {
    const screen = render(Dom.createElement('svg', { viewBox: '0 0 10 10', xmlns: 'http://www.w3.org/2000/svg' }, [
      Dom.createElement('circle', { cx: 5, cy: 5, r: 4 }, [
        Dom.createElement('desc', {}, [
          'I\'m a circle and that description is here to demonstrate how I can be described, but is it really necessary to describe a simple circle like me?'
        ]),
      ]),
    ]));
    expect(screen.container.innerHTML).toEqual('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><circle cx="5" cy="5" r="4"><desc>I\'m a circle and that description is here to demonstrate how I can be described, but is it really necessary to describe a simple circle like me?</desc></circle></svg>');
  });

  it('should render <ellipse>', () => {
    const screen = render(Dom.createElement('svg', { viewBox: '0 0 200 100', xmlns: 'http://www.w3.org/2000/svg' }, [
      Dom.createElement('ellipse', { cx: 100, cy: 50, rx: 100, ry: 50 }),
    ]));
    expect(screen.container.innerHTML).toEqual('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100"><ellipse cx="100" cy="50" rx="100" ry="50"></ellipse></svg>');
  });

  it('should render <foreignObject>', () => {
    const screen = render(Dom.createElement('svg', { viewBox: '0 0 200 200', xmlns: 'http://www.w3.org/2000/svg' }, [
      Dom.createElement('style', {}, ['div { color: white; font: 18px serif; height: 100%; overflow: auto; }']),
      Dom.createElement('polygon', { points: '5,5 195,10 185,185 10,195' }),
      Dom.createElement('foreignObject', { x: 20, y: 20, width: 160, height: 160 }, [
        Dom.createElement('div', { xmlns: 'http://www.w3.org/1999/xhtml' }, ['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed mollis mollis mi ut ultricies. Nullam magna ipsum, porta vel dui convallis, rutrum imperdiet eros. Aliquam erat volutpat.'])
      ]),
    ]));
    expect(screen.container.innerHTML).toEqual('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><style>div { color: white; font: 18px serif; height: 100%; overflow: auto; }</style><polygon points="5,5 195,10 185,185 10,195"></polygon><foreignObject x="20" y="20" width="160" height="160"><div xmlns="http://www.w3.org/1999/xhtml">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed mollis mollis mi ut ultricies. Nullam magna ipsum, porta vel dui convallis, rutrum imperdiet eros. Aliquam erat volutpat.</div></foreignObject></svg>');
  });
});
