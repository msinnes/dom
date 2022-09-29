import {
  createElement,
  BaseElement,
  NormalElement,
  VoidElement,
} from '../HTMLElements';

describe('createElement', () => {
  const selfClosingTags = [
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr',
  ];

  it('should be a function', () => {
    expect(createElement).toBeInstanceOf(Function);
  });

  it('should return VoidElements for elems with self-closing tags', () => {
    selfClosingTags.forEach(tag => {
      const elem = createElement(tag, ' height="100"');
      expect(elem).toBeInstanceOf(VoidElement);
      expect(elem.stringify()).toEqual(`<${tag} height="100" />`);
    });
  });

  it('should return normal elements by default', () => {
    const elem = createElement('div', ' height="100"', '<p>text</p>');
    expect(elem).toBeInstanceOf(NormalElement);
    expect(elem.stringify()).toEqual('<div height="100"><p>text</p></div>');
  });
});

describe('BaseElement', () => {
  it('should be a class', () => {
    expect(BaseElement).toBeInstanceOf(Function);
  });

  it('should be abstract', () => {
    let error;
    try {
      new BaseElement();
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
    expect(error.message.startsWith('TypeError')).toBe(true);
  });

  describe('instance', () => {
    class TestableElement extends BaseElement {}
    let instance;
    beforeEach(() => {
      instance = new TestableElement('div', ' height="100"');
    });

    it('should have a tag prop', () => {
      expect(instance.tag).toEqual('div');
    });

    it('should have a attrs prop', () => {
      expect(instance.attrs).toBe(' height="100"');
    });

    describe('stringify', () => {
      it('should be a function', () => {
        expect(instance.stringify).toBeInstanceOf(Function);
      });

      it('should concatenate the strings and start an opening tag', () => {
        expect(instance.stringify()).toEqual('<div height="100"');
      });
    });
  });
});

describe('NormalElement', () => {
  it('should be a class', () => {
    expect(NormalElement).toBeInstanceOf(Function);
  });

  describe('instance', () => {
    let instance;
    beforeEach(() => {
      instance = new NormalElement('div', ' height="100"', '<p>text</p>');
    });

    it('should be an instance of BaseElement', () => {
      expect(instance).toBeInstanceOf(BaseElement);
    });

    it('should have a tag prop', () => {
      expect(instance.tag).toEqual('div');
    });

    it('should have a attrs prop', () => {
      expect(instance.attrs).toBe(' height="100"');
    });

    it('should have a children prop', () => {
      expect(instance.children).toBe('<p>text</p>');
    });

    describe('stringify', () => {
      it('should be a function', () => {
        expect(instance.stringify).toBeInstanceOf(Function);
      });

      it('should concatenate the strings with an opening and closing tag', () => {
        expect(instance.stringify()).toEqual('<div height="100"><p>text</p></div>');
      });
    });
  });
});

describe('VoidElement', () => {
  it('should be a class', () => {
    expect(VoidElement).toBeInstanceOf(Function);
  });

  describe('instance', () => {
    let instance;
    beforeEach(() => {
      instance = new VoidElement('input', ' height="100"');
    });

    it('should be an instance of BaseElement', () => {
      expect(instance).toBeInstanceOf(BaseElement);
    });

    it('should have a tag prop', () => {
      expect(instance.tag).toEqual('input');
    });

    it('should have a attrs prop', () => {
      expect(instance.attrs).toBe(' height="100"');
    });

    describe('stringify', () => {
      it('should be a function', () => {
        expect(instance.stringify).toBeInstanceOf(Function);
      });

      it('should concatenate the strings with a self-closing tag', () => {
        expect(instance.stringify()).toEqual('<input height="100" />');
      });
    });
  });
});