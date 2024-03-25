import {
  renderArray,
  renderElement,
  renderSvgAttrs,
  renderHtmlAttrs,
  renderElementChildren,
  renderBaseElement,
  renderNormalElement,
  renderVoidElement,
  renderComponent,
} from '../domStringBuilder';

describe('renderArray', () => {
  it('should be a function', () => {
    expect(renderArray).toBeInstanceOf(Function);
  });

  it('should call the render component mock for each component', () => {
    const component1 = { isTextComponent: true, text: 'text1' };
    const component2 = { isTextComponent: true, text: 'text2' };
    expect(renderArray([component1, component2])).toEqual('text1text2');
  });
});

describe('renderElement', () => {
  it('should be a function', () => {
    expect(renderElement).toBeInstanceOf(Function);
  });

  it('should render a self-closing tag if the element has a void tag', () => {
    expect(renderElement({ elem : { tag: 'input', elem: { value: 'text' }, props: {}, isSvgComponent: false }})).toEqual('<input value="text" />');
  });

  it('should render a normal element by default', () => {
    expect(renderElement({
      elem: {
        tag: 'div',
        elem: { width: 'width' },
      },
      children: [{ isTextComponent: true, text: 'text' }],
      props: {},
      isSvgComponent: false,
    })).toEqual('<div width="width">text</div>');
  });

  it('should render an svg component', () => {
    expect(renderElement({
      props: { cx: 40, cy: 30, r: 20 },
      isSvgComponent: true,
      elem: { tag: 'circle' }
    })).toEqual('<circle cx="40" cy="30" r="20"></circle>');
  });

  it('should filter tags with camel case', () => {
    expect(renderElement({
      props: {},
      isSvgComponent: true,
      elem: { tag: 'animatetransform' }
    })).toEqual('<animateTransform></animateTransform>');
  });
});

describe('renderSvgAttrs', () => {
  it('should be a function', () => {
    expect(renderSvgAttrs).toBeInstanceOf(Function);
  });

  it('should accumulate valid html attributes into a string', () => {
    expect(renderSvgAttrs({
      cx: 10,
      cy: 20,
    })).toEqual(' cx="10" cy="20"');
  });

  it('should not stringify invalid attributes', () => {
    expect(renderSvgAttrs({
      invalid: 'invalid',
      cx: 10,
      cy: 20,
    })).toEqual(' cx="10" cy="20"');
  });

  it('should return an empty string if an element has no attrs', () => {
    expect(renderSvgAttrs({})).toEqual('');
  });

  it('should append xmlns if the input is an svg component', () => {
    expect(renderSvgAttrs({
      cx: 10,
      cy: 20,
    })).toEqual(' cx="10" cy="20"');
    expect(renderSvgAttrs({
      cx: 10,
      cy: 20,
    }, 'svg')).toEqual(' cx="10" cy="20" xmlns=\"http://www.w3.org/2000/svg\"');
  });
});

describe('renderHtmlAttrs', () => {
  it('should be a function', () => {
    expect(renderHtmlAttrs).toBeInstanceOf(Function);
  });

  it('should accumulate valid html attributes into a string', () => {
    expect(renderHtmlAttrs({
      height: 'height',
      width: 'width',
    })).toEqual(' height="height" width="width"');
  });

  it('should not stringify invalid attributes', () => {
    expect(renderHtmlAttrs({
      invalid: 'invalid',
      height: 'height',
      width: 'width',
    })).toEqual(' height="height" width="width"');
  });

  it('should write className to the class attr', () => {
    expect(renderHtmlAttrs({
      className: 'className',
      height: 'height',
      width: 'width',
    })).toEqual(' class="className" height="height" width="width"');
  });

  it('should return an empty string if there are no attrs', () => {
    expect(renderHtmlAttrs({
      invalid: 'invalid',
    })).toEqual('');
  });
});

describe('renderElementChildren', () => {
  it('should be a function', () => {
    expect(renderElementChildren).toBeInstanceOf(Function);
  });

  it('should return the rendered children array if the element has children', () => {
    expect(renderElementChildren({
      children: [
        { isTextComponent: true, text: 'text' },
        { isEmptyComponent: true },
      ],
    })).toEqual('text');
  });

  it('should return textContent if there are no children', () => {
    expect(renderElementChildren({
      textContent: 'textContent',
    })).toEqual('textContent');
  });

  it('should render innerText if there is not children or text content', () => {
    expect(renderElementChildren({
      innerText: 'innerText',
    })).toEqual('innerText');
  });

  it('should render innerHTML if there is not children or text content', () => {
    expect(renderElementChildren({
      innerHTML: 'innerHTML',
    })).toEqual('innerHTML');
  });

  it('should return an empty string if there are no children and there is no other content prop', () => {
    expect(renderElementChildren({})).toEqual('');
  });
});

describe('renderBaseElement', () => {
  it('should be a function', () => {
    expect(renderBaseElement).toBeInstanceOf(Function);
  });

  it('should return the string with a tag', () => {
    expect(renderBaseElement('br', '')).toEqual('<br');
  });

  it('should return a string with tags and attributes', () => {
    expect(renderBaseElement('input', ' value="value"')).toEqual('<input value="value"');
  });
});

describe('renderNormalElement', () => {
  it('should be a function', () => {
    expect(renderNormalElement).toBeInstanceOf(Function);
  });

  it('should return the string with a tag', () => {
    expect(renderNormalElement('div', '', '')).toEqual('<div></div>');
  });

  it('should return a string with tags and attributes', () => {
    expect(renderNormalElement('div', ' width="width"', '')).toEqual('<div width="width"></div>');
  });

  it('should return a string with a tag, attributes, and children', () => {
    expect(renderNormalElement('div', ' width="width"', 'text')).toEqual('<div width="width">text</div>');
  });
});

describe('renderVoidElement', () => {
  it('should be a function', () => {
    expect(renderVoidElement).toBeInstanceOf(Function);
  });

  it('should return the string with a tag', () => {
    expect(renderVoidElement('br', '')).toEqual('<br />');
  });

  it('should return a string with tags and attributes', () => {
    expect(renderVoidElement('input', ' value="value"')).toEqual('<input value="value" />');
  });
});

describe('renderComponent', () => {
  it('should be a function', () => {
    expect(renderComponent).toBeInstanceOf(Function);
  });

  it('should return an empty string for empty components', () => {
    const emptyComponent = { isEmptyComponent: true };
    expect(renderComponent(emptyComponent)).toEqual('');
  });

  it('should return text for a text component', () => {
    const textComponent = { isTextComponent: true, text: 'text' };
    expect(renderComponent(textComponent)).toEqual('text');
  });

  it('should return a void element render', () => {
    const elementComponent = { isElementComponent: true, isSvgComponent: false, elem: { tag: 'input', elem: { value: 'value' } } };
    expect(renderComponent(elementComponent)).toEqual('<input value="value" />');
  });

  it('should return a normal element render', () => {
    const elementComponent = {
      isElementComponent: true,
      isSvgComponent: false,
      elem: { tag: 'div', elem: { width: 'width' } },
      children: [{ isTextComponent: true, text: 'text' }],
      props: {},
    };
    expect(renderComponent(elementComponent)).toEqual('<div width="width">text</div>');
  });

  it('should return the render of function component children', () => {
    const functionComponent = {
      isFunctionComponent: true,
      children: [{ isTextComponent: true, text: 'text' }],
    };
    expect(renderComponent(functionComponent)).toEqual('text');
  });

  it('should return the render of class component children', () => {
    const classComponent = {
      isClassComponent: true,
      children: [{ isTextComponent: true, text: 'text' }],
    };
    expect(renderComponent(classComponent)).toEqual('text');
  });

  it('should return the render of root component children', () => {
    const rootComponent = {
      isRootComponent: true,
      children: [{ isTextComponent: true, text: 'text' }],
    };
    expect(renderComponent(rootComponent)).toEqual('text');
  });
});
