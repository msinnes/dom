/**
 * @jest-environment jsdom
 */
import { checkAncestors, getRole, TagToRoleMap } from '../getRole';

const createElement = tag => document.createElement(tag);

describe('getRole', () => {
  it('should be a function', () => {
    expect(getRole).toBeInstanceOf(Function);
  });

  it('should return elem.role if the element has an assigned role', () => {
    const mockElem = createElement('div');
    mockElem.role = 'role';
    expect(getRole(mockElem)).toEqual('role');
  });

  it('should lookup the lowercase of an element tag and return the execution of a function if the entry is a function', () => {
    const mockElem = createElement('header');
    expect(getRole(mockElem)).toEqual('contentinfo');
  });

  it('should return whatever was found on tag to role map if it is not a function', () => {
    const mockArticle = createElement('article');
    const mockNotAvailable = createElement('notavailable');
    expect(getRole(mockArticle)).toEqual('article');
    expect(getRole(mockNotAvailable)).toBeUndefined();
  });
});

describe('checkAncestors', () => {
  it('should be a function', () => {
    expect(checkAncestors).toBeInstanceOf(Function);
  });

  it('it should call the mock for each of the input element\'s parents', () => {
    const mockElem = createElement('div');
    const mockParent1 = createElement('div');
    const mockParent2 = createElement('div');
    mockParent2.appendChild(mockParent1);
    mockParent1.appendChild(mockElem);
    const mock = jest.fn();

    checkAncestors(mockElem, mock);
    expect(mock).toHaveBeenCalledTimes(2);
    expect(mock).toHaveBeenCalledWith(mockParent1);
    expect(mock).toHaveBeenCalledWith(mockParent2);
  });

  it('should return false if the element has no parent', () => {
    const mockElem = createElement('div');
    expect(checkAncestors(mockElem)).toBe(false);
  });

  it('should return false if no parent element matches the input criteria', () => {
    const mockElem = createElement('div');
    const mockParent1 = createElement('div');
    const mockParent2 = createElement('div');
    mockParent2.appendChild(mockParent1);
    mockParent1.appendChild(mockElem);
    const mock = jest.fn(elem => elem.tagName === 'NOTDIV');

    expect(checkAncestors(mockElem, mock)).toBe(false);
    expect(mock).toHaveBeenCalledTimes(2);
    expect(mock).toHaveBeenCalledWith(mockParent1);
    expect(mock).toHaveBeenCalledWith(mockParent2);
  });

  it('should return true if a matches the input criteria', () => {
    const mockElem = createElement('div');
    const mockParent1 = createElement('div');
    const mockParent2 = createElement('div');
    mockParent2.appendChild(mockParent1);
    mockParent1.appendChild(mockElem);
    const mock = jest.fn(elem => elem.tagName === 'DIV');

    expect(checkAncestors(mockElem, mock)).toBe(true);
    expect(mock).toHaveBeenCalledTimes(1);
    expect(mock).toHaveBeenCalledWith(mockParent1);
  });
});

// checked in 0.0.12-alpha.0
describe('TagToRoleMap', () => {
  describe('should support <a>', () => {
    it('should be a function', () => {
      expect(TagToRoleMap.a).toBeInstanceOf(Function);
    });

    it('should return link if anchor has an href', () => {
      const mockElement = createElement('a');
      mockElement.href = 'href';
      expect(TagToRoleMap.a(mockElement)).toEqual('link');
    });

    it('should return generic if anchor has no href', () => {
      const mockElement = createElement('a');
      expect(TagToRoleMap.a(mockElement)).toEqual('generic');
    });
  });

  it('should support <abbr>', () => {
    expect(TagToRoleMap.abbr).toBeUndefined();
  });

  it('should support <address>', () => {
    expect(TagToRoleMap.address).toEqual('group');
  });

  describe('should support <area>', () => {
    it('should be a function', () => {
      expect(TagToRoleMap.area).toBeInstanceOf(Function);
    });

    it('should return link if area has an href', () => {
      const mockElement = createElement('a');
      mockElement.href = 'href';
      expect(TagToRoleMap.area(mockElement)).toEqual('link');
    });

    it('should return generic if area has no href', () => {
      const mockElement = createElement('a');
      expect(TagToRoleMap.area(mockElement)).toEqual('generic');
    });
  });

  it('should support <article>', () => {
    expect(TagToRoleMap.article).toEqual('article');
  });

  it('should support <aside>', () => {
    expect(TagToRoleMap.aside).toEqual('complementary');
  });

  it('should support <audio>', () => {
    expect(TagToRoleMap.audio).toBeUndefined();
  });

  it('should support <b>', () => {
    expect(TagToRoleMap.b).toEqual('generic');
  });

  it('should support <base>', () => {
    expect(TagToRoleMap.base).toBeUndefined();
  });

  it('should support <bdi>', () => {
    expect(TagToRoleMap.bdi).toEqual('generic');
  });

  it('should support <bdo>', () => {
    expect(TagToRoleMap.bdo).toEqual('generic');
  });

  it('should support <blockquote>', () => {
    expect(TagToRoleMap.blockquote).toEqual('blockquote');
  });

  it('should support <body>', () => {
    expect(TagToRoleMap.body).toEqual('generic');
  });

  it('should suppport <br>', () => {
    expect(TagToRoleMap.br).toBeUndefined();
  });

  it('should support <button>', () => {
    expect(TagToRoleMap.button).toEqual('button');
  });

  it('should suppport <canvas>', () => {
    expect(TagToRoleMap.canvas).toBeUndefined();
  });

  it('should support <caption>', () => {
    expect(TagToRoleMap.caption).toEqual('caption');
  });

  it('should suppport <cite>', () => {
    expect(TagToRoleMap.cite).toBeUndefined();
  });

  it('should support <code>', () => {
    expect(TagToRoleMap.code).toEqual('code');
  });

  it('should suppport <col>', () => {
    expect(TagToRoleMap.col).toBeUndefined();
  });

  it('should suppport <colgroup>', () => {
    expect(TagToRoleMap.colgroup).toBeUndefined();
  });

  it('should support <data>', () => {
    expect(TagToRoleMap.data).toEqual('generic');
  });

  it('should support <datalist>', () => {
    expect(TagToRoleMap.datalist).toEqual('listbox');
  });

  it('should suppport <dd>', () => {
    expect(TagToRoleMap.dd).toBeUndefined();
  });

  it('should support <del>', () => {
    expect(TagToRoleMap.del).toEqual('deletion');
  });

  it('should support <details>', () => {
    expect(TagToRoleMap.details).toEqual('group');
  });

  it('should support <dfn>', () => {
    expect(TagToRoleMap.dfn).toEqual('term');
  });

  it('should support <dialog>', () => {
    expect(TagToRoleMap.dialog).toEqual('dialog');
  });

  it('should support <div>', () => {
    expect(TagToRoleMap.div).toEqual('generic');
  });

  it('should suppport <dl>', () => {
    expect(TagToRoleMap.dl).toBeUndefined();
  });

  it('should suppport <dt>', () => {
    expect(TagToRoleMap.dt).toBeUndefined();
  });

  it('should support <em>', () => {
    expect(TagToRoleMap.em).toEqual('emphasis');
  });

  it('should suppport <embed>', () => {
    expect(TagToRoleMap.embed).toBeUndefined();
  });

  it('should support <fieldset>', () => {
    expect(TagToRoleMap.fieldset).toEqual('group');
  });

  it('should suppport <figcaption>', () => {
    expect(TagToRoleMap.figcaption).toBeUndefined();
  });

  it('should support <figure>', () => {
    expect(TagToRoleMap.figure).toEqual('figure');
  });

  describe('should support <footer>', () => {
    it('should be a function', () => {
      expect(TagToRoleMap.footer).toBeInstanceOf(Function);
    });

    it('should return generic if elem is a child of article, aside, main, nav or section element', () => {
      let elem = createElement('footer');
      let parent = createElement('article');
      parent.appendChild(elem);
      expect(TagToRoleMap.footer(elem)).toEqual('generic');
      elem = createElement('footer');
      parent = createElement('aside');
      parent.appendChild(elem);
      expect(TagToRoleMap.footer(elem)).toEqual('generic');
      elem = createElement('footer');
      parent = createElement('main');
      parent.appendChild(elem);
      expect(TagToRoleMap.footer(elem)).toEqual('generic');
      elem = createElement('footer');
      parent = createElement('nav');
      parent.appendChild(elem);
      expect(TagToRoleMap.footer(elem)).toEqual('generic');
      elem = createElement('footer');
      parent = createElement('section');
      parent.appendChild(elem);
      expect(TagToRoleMap.footer(elem)).toEqual('generic');
    });

    it('should return generic if elem is a child of an elment with article, complementary, main, navigation, or region role', () => {
      let elem = createElement('footer');
      let parent = createElement('div');
      parent.role = 'article';
      parent.appendChild(elem);
      expect(TagToRoleMap.footer(elem)).toEqual('generic');
      elem = createElement('footer');
      parent = createElement('div');
      parent.role = 'complementary';
      parent.appendChild(elem);
      expect(TagToRoleMap.footer(elem)).toEqual('generic');
      elem = createElement('footer');
      parent = createElement('div');
      parent.role = 'main';
      parent.appendChild(elem);
      expect(TagToRoleMap.footer(elem)).toEqual('generic');
      elem = createElement('footer');
      parent = createElement('div');
      parent.role = 'navigation';
      parent.appendChild(elem);
      expect(TagToRoleMap.footer(elem)).toEqual('generic');
      elem = createElement('footer');
      parent = createElement('div');
      parent.role = 'region';
      parent.appendChild(elem);
      expect(TagToRoleMap.footer(elem)).toEqual('generic');
    });

    it('should return contentinfo by default', () => {
      expect(TagToRoleMap.footer(createElement('footer'))).toEqual('contentinfo');
    });
  });

  it('should support <form>', () => {
    expect(TagToRoleMap.form).toEqual('form');
  });

  it('should support <h1>', () => {
    expect(TagToRoleMap.h1).toEqual('heading');
  });

  it('should support <h2>', () => {
    expect(TagToRoleMap.h2).toEqual('heading');
  });

  it('should support <h3>', () => {
    expect(TagToRoleMap.h3).toEqual('heading');
  });

  it('should support <h4>', () => {
    expect(TagToRoleMap.h4).toEqual('heading');
  });

  it('should support <h5>', () => {
    expect(TagToRoleMap.h5).toEqual('heading');
  });

  it('should support <h6>', () => {
    expect(TagToRoleMap.h6).toEqual('heading');
  });

  it('should suppport <head>', () => {
    expect(TagToRoleMap.head).toBeUndefined();
  });

  describe('should support <header>', () => {
    it('should be a function', () => {
      expect(TagToRoleMap.header).toBeInstanceOf(Function);
    });

    it('should return generic if elem is a child of article, aside, main, nav or section element', () => {
      let elem = createElement('header');
      let parent = createElement('article');
      parent.appendChild(elem);
      expect(TagToRoleMap.header(elem)).toEqual('generic');
      elem = createElement('header');
      parent = createElement('aside');
      parent.appendChild(elem);
      expect(TagToRoleMap.header(elem)).toEqual('generic');
      elem = createElement('header');
      parent = createElement('main');
      parent.appendChild(elem);
      expect(TagToRoleMap.header(elem)).toEqual('generic');
      elem = createElement('header');
      parent = createElement('nav');
      parent.appendChild(elem);
      expect(TagToRoleMap.header(elem)).toEqual('generic');
      elem = createElement('header');
      parent = createElement('section');
      parent.appendChild(elem);
      expect(TagToRoleMap.header(elem)).toEqual('generic');
    });

    it('should return generic if elem is a child of an elment with article, complementary, main, navigation, or region role', () => {
      let elem = createElement('header');
      let parent = createElement('div');
      parent.role = 'article';
      parent.appendChild(elem);
      expect(TagToRoleMap.header(elem)).toEqual('generic');
      elem = createElement('header');
      parent = createElement('div');
      parent.role = 'complementary';
      parent.appendChild(elem);
      expect(TagToRoleMap.header(elem)).toEqual('generic');
      elem = createElement('header');
      parent = createElement('div');
      parent.role = 'main';
      parent.appendChild(elem);
      expect(TagToRoleMap.header(elem)).toEqual('generic');
      elem = createElement('header');
      parent = createElement('div');
      parent.role = 'navigation';
      parent.appendChild(elem);
      expect(TagToRoleMap.header(elem)).toEqual('generic');
      elem = createElement('header');
      parent = createElement('div');
      parent.role = 'region';
      parent.appendChild(elem);
      expect(TagToRoleMap.header(elem)).toEqual('generic');
    });

    it('should return contentinfo by default', () => {
      expect(TagToRoleMap.header(createElement('header'))).toEqual('contentinfo');
    });
  });

  it('should support <hgroup>', () => {
    expect(TagToRoleMap.hgroup).toEqual('group');
  });

  it('should support <hr>', () => {
    expect(TagToRoleMap.hr).toEqual('separator');
  });

  it('should support <html>', () => {
    expect(TagToRoleMap.html).toEqual('document');
  });

  it('should support <i>', () => {
    expect(TagToRoleMap.i).toEqual('generic');
  });

  it('should support <iframe>', () => {
    expect(TagToRoleMap.iframe).toBeUndefined();
  });

  describe('should support <img>', () => {
    it('should be a function', () => {
      expect(TagToRoleMap.img).toBeInstanceOf(Function);
    });

    it('should return img if alt is text with length', () => {
      const mockElement = createElement('img');
      mockElement.alt = 'text';
      expect(TagToRoleMap.img(mockElement)).toEqual('img');
    });

    // TODO: this should return an array on presentation, none
    it('should return presentation if alt is empty text', () => {
      const mockElement = createElement('img');
      mockElement.alt = '';
      expect(TagToRoleMap.img(mockElement)).toEqual('presentation');
    });

    // alt cannot be deleted, but this is true from docs
    // it('should return img if alt is not present', () => {
    //   const mockElement = createElement('img');
    //   delete mockElement.alt;
    //   expect(TagToRoleMap.img(mockElement)).toEqual('img');
    // });
  });

  describe('should support <input>', () => {
    it('should be a function', () => {
      expect(TagToRoleMap.input).toBeInstanceOf(Function);
    });

    it('should return button when type is button', () => {
      const mockElement = createElement('input');
      mockElement.type = 'button';
      expect(TagToRoleMap.input(mockElement)).toEqual('button');
    });

    it('should return checkbox if type is checkbox', () => {
      const mockElement = createElement('input');
      mockElement.type = 'checkbox';
      expect(TagToRoleMap.input(mockElement)).toEqual('checkbox');
    });

    it('should return undefined if type is color', () => {
      const mockElement = createElement('input');
      mockElement.type = 'color';
      expect(TagToRoleMap.input(mockElement)).toBeUndefined();
    });

    it('should return undefined if type is date', () => {
      const mockElement = createElement('input');
      mockElement.type = 'date';
      expect(TagToRoleMap.input(mockElement)).toBeUndefined();
    });

    it('should return undefined if type is datetime-local', () => {
      const mockElement = createElement('input');
      mockElement.type = 'datetime-local';
      expect(TagToRoleMap.input(mockElement)).toBeUndefined();
    });

    it('should return textbox when type is email and list attribute is undefined', () => {
      const mockElement = createElement('input');
      mockElement.type = 'email';
      const mockList = createElement('datalist');
      mockList.id = 'datalist-id';
      document.body.appendChild(mockElement);
      document.body.appendChild(mockList);
      expect(TagToRoleMap.input(mockElement)).toEqual('textbox');
      mockElement.setAttribute('list', 'datalist-id');
      expect(TagToRoleMap.input(mockElement)).toEqual('combobox');
    });

    it('should return undefined if type is file', () => {
      const mockElement = createElement('input');
      mockElement.type = 'file';
      expect(TagToRoleMap.input(mockElement)).toBeUndefined();
    });

    it('should return undefined if type is hidden', () => {
      const mockElement = createElement('input');
      mockElement.type = 'hidden';
      expect(TagToRoleMap.input(mockElement)).toBeUndefined();
    });

    it('should return button when type is image', () => {
      const mockElement = createElement('input');
      mockElement.type = 'image';
      expect(TagToRoleMap.input(mockElement)).toEqual('button');
    });

    it('should return undefined if type is month', () => {
      const mockElement = createElement('input');
      mockElement.type = 'month';
      expect(TagToRoleMap.input(mockElement)).toBeUndefined();
    });

    it('should return spinbutton when type is number', () => {
      const mockElement = createElement('input');
      mockElement.type = 'number';
      expect(TagToRoleMap.input(mockElement)).toEqual('spinbutton');
    });

    it('should return undefined when type is password', () => {
      const mockElement = createElement('input');
      mockElement.type = 'password';
      expect(TagToRoleMap.input(mockElement)).toBeUndefined();
    });

    it('should return radio when type is radio', () => {
      const mockElement = createElement('input');
      mockElement.type = 'radio';
      expect(TagToRoleMap.input(mockElement)).toEqual('radio');
    });

    it('should return slider when type is range', () => {
      const mockElement = createElement('input');
      mockElement.type = 'range';
      expect(TagToRoleMap.input(mockElement)).toEqual('slider');
    });

    it('should return button when type is reset', () => {
      const mockElement = createElement('input');
      mockElement.type = 'reset';
      expect(TagToRoleMap.input(mockElement)).toEqual('button');
    });

    it('should return searchbox when type is search and list attribute is undefined', () => {
      const mockElement = createElement('input');
      mockElement.type = 'search';
      const mockList = createElement('datalist');
      mockList.id = 'datalist-id';
      document.body.appendChild(mockElement);
      document.body.appendChild(mockList);
      expect(TagToRoleMap.input(mockElement)).toEqual('searchbox');
      mockElement.setAttribute('list', 'datalist-id');
      expect(TagToRoleMap.input(mockElement)).toEqual('combobox');
    });

    it('should return button when type is submit', () => {
      const mockElement = createElement('input');
      mockElement.type = 'submit';
      expect(TagToRoleMap.input(mockElement)).toEqual('button');
    });

    it('should return textbox when type is tel and list attribute is undefined', () => {
      const mockElement = createElement('input');
      mockElement.type = 'tel';
      const mockList = createElement('datalist');
      mockList.id = 'datalist-id';
      document.body.appendChild(mockElement);
      document.body.appendChild(mockList);
      expect(TagToRoleMap.input(mockElement)).toEqual('textbox');
      mockElement.setAttribute('list', 'datalist-id');
      expect(TagToRoleMap.input({ type: 'tel', list: true })).toEqual('combobox');
    });

    it('should return textbox when type is text and list attribute is undefined', () => {
      const mockElement = createElement('input');
      mockElement.type = 'text';
      const mockList = createElement('datalist');
      mockList.id = 'datalist-id';
      document.body.appendChild(mockElement);
      document.body.appendChild(mockList);
      expect(TagToRoleMap.input(mockElement)).toEqual('textbox');
      mockElement.setAttribute('list', 'datalist-id');
      expect(TagToRoleMap.input({ type: 'text', list: true })).toEqual('combobox');
    });

    it('should return undefined if type is time', () => {
      const mockElement = createElement('input');
      mockElement.type = 'time';
      expect(TagToRoleMap.input(mockElement)).toBeUndefined();
    });

    it('should return textbox when type is url and list attribute is undefined', () => {
      const mockElement = createElement('input');
      mockElement.type = 'url';
      const mockList = createElement('datalist');
      mockList.id = 'datalist-id';
      document.body.appendChild(mockElement);
      document.body.appendChild(mockList);
      expect(TagToRoleMap.input(mockElement)).toEqual('textbox');
      mockElement.setAttribute('list', 'datalist-id');
      expect(TagToRoleMap.input({ type: 'url', list: true })).toEqual('combobox');
    });

    it('should return undefined if type is week', () => {
      const mockElement = createElement('input');
      mockElement.type = 'week';
      expect(TagToRoleMap.input(mockElement)).toBeUndefined();
    });
  });

  it('should support <ins>', () => {
    expect(TagToRoleMap.ins).toEqual('insertion');
  });

  it('should support <kbd>', () => {
    expect(TagToRoleMap.kbd).toBeUndefined();
  });

  it('should support <label>', () => {
    expect(TagToRoleMap.label).toBeUndefined();
  });

  it('should support <legend>', () => {
    expect(TagToRoleMap.legend).toBeUndefined();
  });

  describe('should support <li>', () => {
    it('should be a function', () => {
      expect(TagToRoleMap.li).toBeInstanceOf(Function);
    });

    it('should return generic if li is not a child of ul, ol, or menu', () => {
      const mockLi = document.createElement('li');
      const mockDiv = document.createElement('div');
      mockDiv.appendChild(mockLi);

      expect(TagToRoleMap.li(mockLi)).toEqual('generic');
    });

    it('should return listitem if li is a child of ul', () => {
      const mockLi = document.createElement('li');
      const mockDiv = document.createElement('div');
      const mockUl = document.createElement('ul');
      mockDiv.appendChild(mockLi);
      mockUl.appendChild(mockDiv);

      expect(TagToRoleMap.li(mockLi)).toEqual('listitem');
    });

    it('should return listitem if li is a child of ol', () => {
      const mockLi = document.createElement('li');
      const mockDiv = document.createElement('div');
      const mockOl = document.createElement('ol');
      mockDiv.appendChild(mockLi);
      mockOl.appendChild(mockDiv);

      expect(TagToRoleMap.li(mockLi)).toEqual('listitem');
    });

    it('should return listitem if li is a child of menu', () => {
      const mockLi = document.createElement('li');
      const mockMenu = document.createElement('menu');
      mockMenu.appendChild(mockLi);

      expect(TagToRoleMap.li(mockLi)).toEqual('listitem');
    });
  });

  it('should support <link>', () => {
    expect(TagToRoleMap.link).toBeUndefined();
  });

  it('should support <main>', () => {
    expect(TagToRoleMap.main).toEqual('main');
  });

  it('should support <map>', () => {
    expect(TagToRoleMap.map).toBeUndefined();
  });

  it('should support <math>', () => {
    expect(TagToRoleMap.math).toEqual('math');
  });

  it('should support <menu>', () => {
    expect(TagToRoleMap.menu).toEqual('list');
  });

  it('should support <meta>', () => {
    expect(TagToRoleMap.meta).toBeUndefined();
  });

  it('should support <meter>', () => {
    expect(TagToRoleMap.meter).toEqual('meter');
  });

  it('should support <nav>', () => {
    expect(TagToRoleMap.nav).toEqual('navigation');
  });

  it('should support <noscript>', () => {
    expect(TagToRoleMap.noscript).toBeUndefined();
  });

  it('should support <object>', () => {
    expect(TagToRoleMap.object).toBeUndefined();
  });

  it('should support <ol>', () => {
    expect(TagToRoleMap.ol).toEqual('list');
  });

  it('should support <optgroup>', () => {
    expect(TagToRoleMap.optgroup).toEqual('group');
  });

  describe('should support <option>', () => {
    it('should be a function', () => {
      expect(TagToRoleMap.option).toBeInstanceOf(Function);
    });

    it('should return option if elem is a child of parent with list role (ol, ul, menu)', () => {
      let elem = createElement('option');
      let parent = createElement('ol');
      parent.appendChild(elem);
      expect(TagToRoleMap.option(elem)).toEqual('option');
      elem = createElement('option');
      parent = createElement('ul');
      parent.appendChild(elem);
      expect(TagToRoleMap.option(elem)).toEqual('option');
      elem = createElement('option');
      parent = createElement('menu');
      parent.appendChild(elem);
      expect(TagToRoleMap.option(elem)).toEqual('option');
    });

    it('should return option if the option is a child of select', () => {
      let elem = createElement('option');
      let parent = createElement('select');
      parent.appendChild(elem);
      expect(TagToRoleMap.option(elem)).toEqual('option');
    });

    it('should return option if the option is a child of datalist', () => {
      let elem = createElement('option');
      let parent = createElement('datalist');
      parent.appendChild(elem);
      expect(TagToRoleMap.option(elem)).toEqual('option');
    });

    it('should return nothing otherwise', () => {
      expect(TagToRoleMap.option(createElement('options'))).toBeUndefined();
    });
  });

  it('should support <output>', () => {
    expect(TagToRoleMap.output).toEqual('status');
  });

  it('should support <p>', () => {
    expect(TagToRoleMap.p).toEqual('paragraph');
  });

  it('should support <param>', () => {
    expect(TagToRoleMap.param).toBeUndefined();
  });

  it('should support <picture>', () => {
    expect(TagToRoleMap.picture).toBeUndefined();
  });

  it('should support <pre>', () => {
    expect(TagToRoleMap.pre).toEqual('generic');
  });

  it('should support <progress>', () => {
    expect(TagToRoleMap.progress).toEqual('progressbar');
  });

  it('should support <q>', () => {
    expect(TagToRoleMap.q).toEqual('generic');
  });

  it('should support <rp>', () => {
    expect(TagToRoleMap.rp).toBeUndefined();
  });

  it('should support <rt>', () => {
    expect(TagToRoleMap.rt).toBeUndefined();
  });

  it('should support <ruby>', () => {
    expect(TagToRoleMap.ruby).toBeUndefined();
  });

  it('should support <s>', () => {
    expect(TagToRoleMap.s).toEqual('deletion');
  });

  it('should support <samp>', () => {
    expect(TagToRoleMap.samp).toEqual('generic');
  });

  it('should support <script>', () => {
    expect(TagToRoleMap.script).toBeUndefined();
  });

  it('should support <search>', () => {
    expect(TagToRoleMap.search).toEqual('search');
  });

  describe('should support <section>', () => {
    it('should be a function', () => {
      expect(TagToRoleMap.section).toBeInstanceOf(Function);
    });

    it('should return region if the section has an accessible name', () => {
      const elem = createElement('section');
      elem.name = 'name';
      expect(TagToRoleMap.section(elem)).toEqual('region');
    });

    it('should return generic if there is no accessible name', () => {
      const elem = createElement('section');
      expect(TagToRoleMap.section(elem)).toEqual('generic');
      elem.name = '';
      expect(TagToRoleMap.section(elem)).toEqual('generic');
    });
  });

  describe('should support <select>', () => {
    it('should be a function', () => {
      expect(TagToRoleMap.select).toBeInstanceOf(Function);
    });

    it('should return combobox if element has no multiple attr or size is no greater than 1', () => {
      const elem = createElement('select');
      expect(TagToRoleMap.select(elem)).toEqual('combobox');
      elem.size = 1;
      expect(TagToRoleMap.select(elem)).toEqual('combobox');
    });

    it('should return listbox if element has multiple attr or size is greater than 1', () => {
      let elem = createElement('select');
      elem.multiple = true;
      expect(TagToRoleMap.select(elem)).toEqual('listbox');
      elem = createElement('select');
      elem.size = 2;
      expect(TagToRoleMap.select(elem)).toEqual('listbox');
    });
  });

  it('should support <slot>', () => {
    expect(TagToRoleMap.slot).toBeUndefined();
  });

  it('should support <small>', () => {
    expect(TagToRoleMap.small).toEqual('generic');
  });

  it('should support <source>', () => {
    expect(TagToRoleMap.source).toBeUndefined();
  });

  it('should support <span>', () => {
    expect(TagToRoleMap.span).toEqual('generic');
  });

  it('should support <strong>', () => {
    expect(TagToRoleMap.strong).toEqual('strong');
  });

  it('should support <style>', () => {
    expect(TagToRoleMap.style).toBeUndefined();
  });

  it('should support <sub>', () => {
    expect(TagToRoleMap.sub).toEqual('subscript');
  });

  it('should support <summary>', () => {
    expect(TagToRoleMap.summary).toBeUndefined();
  });

  it('should support <sup>', () => {
    expect(TagToRoleMap.sup).toEqual('superscript');
  });

  it('should support <SVG>', () => {
    expect(TagToRoleMap.svg).toEqual('graphics-document');
  });

  it('should support <table>', () => {
    expect(TagToRoleMap.table).toEqual('table');
  });

  it('should support <tbody>', () => {
    expect(TagToRoleMap.tbody).toEqual('rowgroup');
  });


  describe('should support <td>', () => {
    it('should be a function', () => {
      expect(TagToRoleMap.td).toBeInstanceOf(Function);
    });

    it('should return cell if child of table with table role', () => {
      const elem = createElement('td');
      const row = createElement('tr');
      const table = createElement('table');
      table.appendChild(row);
      row.appendChild(elem);
      expect(TagToRoleMap.td(elem)).toEqual('cell');
    });

    it('should return gridcell if isDescendantOf table with table role', () => {
      const elem = createElement('td');
      const row = createElement('tr');
      const table = createElement('table');
      table.appendChild(row);
      row.appendChild(elem);
      table.role = 'grid';
      expect(TagToRoleMap.td(elem)).toEqual('gridcell');
      table.role = 'treegrid';
      expect(TagToRoleMap.td(elem)).toEqual('gridcell');
    });

    it('should not have a role if table does not have table, grid, or gridcell role', () => {
      const elem = createElement('td');
      const row = createElement('tr');
      const table = createElement('table');
      table.appendChild(row);
      row.appendChild(elem);
      table.role = 'not a table';
      expect(TagToRoleMap.td(elem)).toBeUndefined();
    });
  });

  it('should support <template>', () => {
    expect(TagToRoleMap.template).toBeUndefined();
  });

  it('should support <textarea>', () => {
    expect(TagToRoleMap.textarea).toEqual('textbox');
  });

  it('should support <tfoot>', () => {
    expect(TagToRoleMap.tfoot).toEqual('rowgroup');
  });

  // TODO: role calculation of th prop should include columnheader and rowheader
  describe('should support <th>', () => {
    it('should be a function', () => {
      expect(TagToRoleMap.th).toBeInstanceOf(Function);
    });

    it('should return cell if child of table with table role', () => {
      const elem = createElement('th');
      const row = createElement('tr');
      const table = createElement('table');
      table.appendChild(row);
      row.appendChild(elem);
      expect(TagToRoleMap.th(elem)).toEqual('cell');
    });

    it('should return gridcell if isDescendantOf table with table role', () => {
      const elem = createElement('th');
      const row = createElement('tr');
      const table = createElement('table');
      table.appendChild(row);
      row.appendChild(elem);
      table.role = 'grid';
      expect(TagToRoleMap.th(elem)).toEqual('gridcell');
      table.role = 'treegrid';
      expect(TagToRoleMap.th(elem)).toEqual('gridcell');
    });

    it('should not have a role if table does not have table, grid, or gridcell role', () => {
      const elem = createElement('th');
      const row = createElement('tr');
      const table = createElement('table');
      table.appendChild(row);
      row.appendChild(elem);
      table.role = 'not a table';
      expect(TagToRoleMap.th(elem)).toBeUndefined();
    });
  });

  it('should support <thead>', () => {
    expect(TagToRoleMap.thead).toEqual('rowgroup');
  });

  it('should support <time>', () => {
    expect(TagToRoleMap.time).toEqual('time');
  });

  it('should support <title>', () => {
    expect(TagToRoleMap.title).toBeUndefined();
  });

  it('should support <tr>', () => {
    expect(TagToRoleMap.tr).toEqual('row');
  });

  it('should support <track>', () => {
    expect(TagToRoleMap.track).toBeUndefined();
  });

  it('should support <u>', () => {
    expect(TagToRoleMap.u).toEqual('generic');
  });

  it('should support <ul>', () => {
    expect(TagToRoleMap.ul).toEqual('list');
  });

  it('should support <var>', () => {
    expect(TagToRoleMap.var).toBeUndefined();
  });

  it('should support <video>', () => {
    expect(TagToRoleMap.video).toBeUndefined();
  });

  it('should support <wbr>', () => {
    expect(TagToRoleMap.wbr).toBeUndefined();
  });
});
