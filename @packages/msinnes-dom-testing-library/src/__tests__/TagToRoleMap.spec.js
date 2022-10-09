import { TagToRoleMap } from '../TagToRoleMap';

describe('TagToRoleMap', () => {
  it('should support <a>', () => {
    expect(TagToRoleMap.a).toBeInstanceOf(Function);
    expect(TagToRoleMap.a({ href: 'href' })).toEqual('link');
    expect(TagToRoleMap.a({})).toEqual('generic');
  });

  it('should support <area>', () => {
    expect(TagToRoleMap.area).toBeInstanceOf(Function);
    expect(TagToRoleMap.area({ href: 'href' })).toEqual('link');
    expect(TagToRoleMap.area({})).toEqual('generic');
  });

  it('should support <article>', () => {
    expect(TagToRoleMap.article).toEqual('article');
  });

  it('should support <aside>', () => {
    expect(TagToRoleMap.aside).toEqual('complementary');
  });

  it('should support <b>', () => {
    expect(TagToRoleMap.b).toEqual('generic');
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

  it('should support <button>', () => {
    expect(TagToRoleMap.button).toEqual('button');
  });

  it('should support <caption>', () => {
    expect(TagToRoleMap.caption).toEqual('caption');
  });

  it('should support <code>', () => {
    expect(TagToRoleMap.code).toEqual('code');
  });

  it('should support <data>', () => {
    expect(TagToRoleMap.data).toEqual('generic');
  });

  it('should support <datalist>', () => {
    expect(TagToRoleMap.datalist).toEqual('listbox');
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

  it('should support <em>', () => {
    expect(TagToRoleMap.em).toEqual('emphasis');
  });

  it('should support <fieldset>', () => {
    expect(TagToRoleMap.fieldset).toEqual('group');
  });

  it('should support <figure>', () => {
    expect(TagToRoleMap.figure).toEqual('figure');
  });

  describe('should support <footer>', () => {
    it('should be a function', () => {
      expect(TagToRoleMap.footer).toBeInstanceOf(Function);
    });

    it('should return contentinfo if parent is an article, aside, main, nav or section element', () => {
      let elem = {
        parent: {
          tagName: 'div',
          parent: {
            tagName: 'article',
          },
        },
      };
      expect(TagToRoleMap.footer(elem)).toEqual('contentinfo');
      elem = {
        parent: {
          tagName: 'aside',
        },
      };
      expect(TagToRoleMap.footer(elem)).toEqual('contentinfo');
      elem = {
        parent: {
          tagName: 'main',
        },
      };
      expect(TagToRoleMap.footer(elem)).toEqual('contentinfo');
      elem = {
        parent: {
          tagName: 'nav',
        },
      };
      expect(TagToRoleMap.footer(elem)).toEqual('contentinfo');
      elem = {
        parent: {
          tagName: 'div',
          parent: {
            tagName: 'section',
          },
        },
      };
      expect(TagToRoleMap.footer(elem)).toEqual('contentinfo');
    });

    it('should return contentinfo if parent has an article, complementary, main, navigation, or region role', () => {
      let elem = {
        parent: {
          role: 'generic',
          tagName: 'div',
          parent: {
            role: 'article',
            tagName: 'div',
          },
        },
      };
      expect(TagToRoleMap.footer(elem)).toEqual('contentinfo');
      elem = {
        parent: {
          tagName: 'div',
          role: 'complementary',
        },
      };
      expect(TagToRoleMap.footer(elem)).toEqual('contentinfo');
      elem = {
        parent: {
          tagName: 'div',
          role: 'main',
        },
      };
      expect(TagToRoleMap.footer(elem)).toEqual('contentinfo');
      elem = {
        parent: {
          tagName: 'div',
          role: 'navigation',
        },
      };
      expect(TagToRoleMap.footer(elem)).toEqual('contentinfo');
      elem = {
        parent: {
          role: 'generic',
          tagName: 'div',
          parent: {
            role: 'region',
            tagName: 'div',
          },
        },
      };
      expect(TagToRoleMap.footer(elem)).toEqual('contentinfo');
    });

    it('should return generic by default', () => {
      expect(TagToRoleMap.footer({})).toEqual('generic');
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

  describe('should support <header>', () => {
    it('should be a function', () => {
      expect(TagToRoleMap.header).toBeInstanceOf(Function);
    });

    it('should return banner if parent is an article, aside, main, nav or section element', () => {
      let elem = {
        parent: {
          tagName: 'div',
          parent: {
            tagName: 'article',
          },
        },
      };
      expect(TagToRoleMap.header(elem)).toEqual('banner');
      elem = {
        parent: {
          tagName: 'aside',
        },
      };
      expect(TagToRoleMap.header(elem)).toEqual('banner');
      elem = {
        parent: {
          tagName: 'main',
        },
      };
      expect(TagToRoleMap.header(elem)).toEqual('banner');
      elem = {
        parent: {
          tagName: 'nav',
        },
      };
      expect(TagToRoleMap.header(elem)).toEqual('banner');
      elem = {
        parent: {
          tagName: 'div',
          parent: {
            tagName: 'section',
          },
        },
      };
      expect(TagToRoleMap.header(elem)).toEqual('banner');
    });

    it('should return banner if parent has an article, complementary, main, navigation, or region role', () => {
      let elem = {
        parent: {
          role: 'generic',
          tagName: 'div',
          parent: {
            role: 'article',
            tagName: 'div',
          },
        },
      };
      expect(TagToRoleMap.header(elem)).toEqual('banner');
      elem = {
        parent: {
          tagName: 'div',
          role: 'complementary',
        },
      };
      expect(TagToRoleMap.header(elem)).toEqual('banner');
      elem = {
        parent: {
          tagName: 'div',
          role: 'main',
        },
      };
      expect(TagToRoleMap.header(elem)).toEqual('banner');
      elem = {
        parent: {
          tagName: 'div',
          role: 'navigation',
        },
      };
      expect(TagToRoleMap.header(elem)).toEqual('banner');
      elem = {
        parent: {
          role: 'generic',
          tagName: 'div',
          parent: {
            role: 'region',
            tagName: 'div',
          },
        },
      };
      expect(TagToRoleMap.header(elem)).toEqual('banner');
    });

    it('should return generic by default', () => {
      expect(TagToRoleMap.header({})).toEqual('generic');
    });
  });

  it('should support <hgroup>', () => {
    expect(TagToRoleMap.hgroup).toEqual('generic');
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

  describe('should support <img>', () => {
    it('should be a function', () => {
      expect(TagToRoleMap.img).toBeInstanceOf(Function);
    });

    it('should return img if alt is text with length', () => {
      expect(TagToRoleMap.img({ alt: 'text' })).toEqual('img');
    });

    it('should return presentation if alt is empty text', () => {
      expect(TagToRoleMap.img({ alt: '' })).toEqual('presentation');
    });

    it('should return img if alt is not present', () => {
      expect(TagToRoleMap.img({})).toEqual('img');
    });
  });

  describe('should support <input>', () => {
    it('should be a function', () => {
      expect(TagToRoleMap.input).toBeInstanceOf(Function);
    });

    it('should return button when type is button', () => {
      expect(TagToRoleMap.input({ type: 'button' })).toEqual('button');
    });

    it('should return checkbox if type is checkbox', () => {
      expect(TagToRoleMap.input({ type: 'checkbox' })).toEqual('checkbox');
    });

    it('should return textbox when type is email and list attribute is undefined', () => {
      expect(TagToRoleMap.input({ type: 'email' })).toEqual('textbox');
      expect(TagToRoleMap.input({ type: 'email', list: true })).toEqual('combobox');
    });

    it('should return button when type is image', () => {
      expect(TagToRoleMap.input({ type: 'image' })).toEqual('button');
    });

    it('should return spinbutton when type is number', () => {
      expect(TagToRoleMap.input({ type: 'number' })).toEqual('spinbutton');
    });

    it('should return radio when type is radio', () => {
      expect(TagToRoleMap.input({ type: 'radio' })).toEqual('radio');
    });

    it('should return slider when type is range', () => {
      expect(TagToRoleMap.input({ type: 'range' })).toEqual('slider');
    });

    it('should return button when type is reset', () => {
      expect(TagToRoleMap.input({ type: 'reset' })).toEqual('button');
    });

    it('should return searchbox when type is search and list attribute is undefined', () => {
      expect(TagToRoleMap.input({ type: 'search' })).toEqual('searchbox');
      expect(TagToRoleMap.input({ type: 'search', list: true })).toEqual('combobox');
    });

    it('should return button when type is submit', () => {
      expect(TagToRoleMap.input({ type: 'submit' })).toEqual('button');
    });

    it('should return textbox when type is tel and list attribute is undefined', () => {
      expect(TagToRoleMap.input({ type: 'tel' })).toEqual('textbox');
      expect(TagToRoleMap.input({ type: 'tel', list: true })).toEqual('combobox');
    });

    it('should return textbox when type is text and list attribute is undefined', () => {
      expect(TagToRoleMap.input({ type: 'text' })).toEqual('textbox');
      expect(TagToRoleMap.input({ type: 'text', list: true })).toEqual('combobox');
    });

    it('should return textbox when type is url and list attribute is undefined', () => {
      expect(TagToRoleMap.input({ type: 'url' })).toEqual('textbox');
      expect(TagToRoleMap.input({ type: 'url', list: true })).toEqual('combobox');
    });
  });

  it('should support <ins>', () => {
    expect(TagToRoleMap.ins).toEqual('insertion');
  });

  it('should support <li>', () => {
    expect(TagToRoleMap.li).toEqual('listitem');
  });

  it('should support <main>', () => {
    expect(TagToRoleMap.main).toEqual('main');
  });

  it('should support <math>', () => {
    expect(TagToRoleMap.math).toEqual('math');
  });

  it('should support <menu>', () => {
    expect(TagToRoleMap.menu).toEqual('list');
  });

  it('should support <meter>', () => {
    expect(TagToRoleMap.meter).toEqual('meter');
  });

  it('should support <nav>', () => {
    expect(TagToRoleMap.nav).toEqual('navigation');
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

    it('should return option if the option is a child of select', () => {
      expect(TagToRoleMap.option({ parent: {
        tagName: 'SELECT',
      } })).toEqual('option');
      expect(TagToRoleMap.option({ parent: {
        tagName: 'DIV',
        parent: {
          tagName: 'SELECT',
        },
      } })).toEqual('option');
      expect(TagToRoleMap.option({})).toBeUndefined();
    });

    it('should return option if the option is a child of datalist', () => {
      expect(TagToRoleMap.option({ parent: {
        tagName: 'DATALIST',
      } })).toEqual('option');
      expect(TagToRoleMap.option({ parent: {
        tagName: 'DIV',
        parent: {
          tagName: 'DATALIST',
        },
      } })).toEqual('option');
      expect(TagToRoleMap.option({})).toBeUndefined();
    });
  });

  it('should support <output>', () => {
    expect(TagToRoleMap.output).toEqual('status');
  });

  it('should support <p>', () => {
    expect(TagToRoleMap.p).toEqual('paragraph');
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

  it('should support <samp>', () => {
    expect(TagToRoleMap.samp).toEqual('generic');
  });

  describe('should support <section>', () => {
    it('should be a function', () => {
      expect(TagToRoleMap.section).toBeInstanceOf(Function);
    });

    it('should return region if element has aria-label', () => {
      expect(TagToRoleMap.section({ ariaLabel: 'label' })).toEqual('region');
      expect(TagToRoleMap.section({ ariaLabel: '' })).toBeUndefined();
      expect(TagToRoleMap.section({})).toBeUndefined();
    });

    it('should return region if element has textContent', () => {
      expect(TagToRoleMap.section({ textContent: 'label' })).toEqual('region');
      expect(TagToRoleMap.section({ textContent: '' })).toBeUndefined();
      expect(TagToRoleMap.section({})).toBeUndefined();
    });
  });

  describe('should support <select>', () => {
    it('should be a function', () => {
      expect(TagToRoleMap.select).toBeInstanceOf(Function);
    });

    it('should return combobox if element has no multiple attr or size is no greater than 1', () => {
      expect(TagToRoleMap.select({})).toEqual('combobox');
      expect(TagToRoleMap.select({ size: 1 })).toEqual('combobox');
    });

    it('should return listbox if element has multiple attr or size is greater than 1', () => {
      expect(TagToRoleMap.select({ multiple: true })).toEqual('listbox');
      expect(TagToRoleMap.select({ size: 2 })).toEqual('listbox');
    });
  });

  it('should support <small>', () => {
    expect(TagToRoleMap.small).toEqual('generic');
  });

  it('should support <span>', () => {
    expect(TagToRoleMap.span).toEqual('generic');
  });

  it('should support <strong>', () => {
    expect(TagToRoleMap.strong).toEqual('strong');
  });

  it('should support <sub>', () => {
    expect(TagToRoleMap.sub).toEqual('subscript');
  });

  it('should support <summary>', () => {
    expect(TagToRoleMap.summary).toEqual('button');
  });

  it('should support <sup>', () => {
    expect(TagToRoleMap.sup).toEqual('superscript');
  });

  it('should support <SVG>', () => {
    expect(TagToRoleMap.SVG).toEqual('graphics-document');
  });

  it('should support <table>', () => {
    expect(TagToRoleMap.table).toEqual('table');
  });

  it('should support <tbody>', () => {
    expect(TagToRoleMap.tbody).toEqual('rowgroup');
  });

  it('should support <textarea>', () => {
    expect(TagToRoleMap.textarea).toEqual('textbox');
  });

  it('should support <tfoot>', () => {
    expect(TagToRoleMap.tfoot).toEqual('rowgroup');
  });

  it('should support <thead>', () => {
    expect(TagToRoleMap.thead).toEqual('rowgroup');
  });

  it('should support <time>', () => {
    expect(TagToRoleMap.time).toEqual('time');
  });

  describe('should support <td>', () => {
    it('should be a function', () => {
      expect(TagToRoleMap.td).toBeInstanceOf(Function);
    });

    it('should return cell if isDescendantOf table with table role', () => {
      expect(TagToRoleMap.td({ parent: {
        role: 'table',
      }})).toEqual('cell');
      expect(TagToRoleMap.td({ parent: {
        role: 'row',
        parent: {
          role: 'table',
        },
      }})).toEqual('cell');
      expect(TagToRoleMap.td({})).toBeUndefined();
    });

    it('should return gridcell if isDescendantOf table with table role', () => {
      expect(TagToRoleMap.td({ parent: {
        role: 'grid',
      }})).toEqual('gridcell');
      expect(TagToRoleMap.td({ parent: {
        role: 'row',
        parent: {
          role: 'treegrid',
        },
      }})).toEqual('gridcell');
      expect(TagToRoleMap.td({})).toBeUndefined();
    });
  });

  // TODO: role calculation of th prop should check whether th is columnheader or rowheader
  describe('should support <th>', () => {
    it('should be a function', () => {
      expect(TagToRoleMap.th).toBeInstanceOf(Function);
    });

    it('should return cell if isDescendantOf table with table role', () => {
      expect(TagToRoleMap.th({ parent: {
        role: 'table',
      }})).toEqual('cell');
      expect(TagToRoleMap.th({ parent: {
        role: 'row',
        parent: {
          role: 'table',
        },
      }})).toEqual('cell');
      expect(TagToRoleMap.th({})).toBeUndefined();
    });

    it('should return gridcell if isDescendantOf table with table role', () => {
      expect(TagToRoleMap.th({ parent: {
        role: 'grid',
      }})).toEqual('gridcell');
      expect(TagToRoleMap.th({ parent: {
        role: 'row',
        parent: {
          role: 'treegrid',
        },
      }})).toEqual('gridcell');
      expect(TagToRoleMap.td({})).toBeUndefined();
    });
  });

  it('should support <tr>', () => {
    expect(TagToRoleMap.tr).toEqual('row');
  });

  it('should support <u>', () => {
    expect(TagToRoleMap.u).toEqual('generic');
  });

  it('should support <ul>', () => {
    expect(TagToRoleMap.ul).toEqual('list');
  });
});