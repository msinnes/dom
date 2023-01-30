import {
  renderArray,
  renderElement,
  renderAttrs,
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
    expect(renderElement({ elem : { tag: 'input', elem: { value: 'text' } }})).toEqual('<input value="text" />');
  });

  it('should render a normal element by default', () => {
    expect(renderElement({
      elem: {
        tag: 'div',
        elem: { width: 'width' },
      },
      children: [{ isTextComponent: true, text: 'text' }],
    })).toEqual('<div width="width">text</div>');
  });
});

describe('renderAttrs', () => {
  it('should be a function', () => {
    expect(renderAttrs).toBeInstanceOf(Function);
  });

  it('should accumulate valid html attributes into a string', () => {
    expect(renderAttrs({
      height: 'height',
      width: 'width',
    })).toEqual(' height="height" width="width"');
  });

  it('should not stringify invalid attributes', () => {
    expect(renderAttrs({
      invalid: 'invalid',
      height: 'height',
      width: 'width',
    })).toEqual(' height="height" width="width"');
  });

  it('should write className to the class attr', () => {
    expect(renderAttrs({
      className: 'className',
      height: 'height',
      width: 'width',
    })).toEqual(' class="className" height="height" width="width"');
  });

  it('should return an empty string if there are no attrs', () => {
    expect(renderAttrs({
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
    const elementComponent = { isElementComponent: true, elem: { tag: 'input', elem: { value: 'value' } } };
    expect(renderComponent(elementComponent)).toEqual('<input value="value" />');
  });

  it('should return a normal element render', () => {
    const elementComponent = {
      isElementComponent: true,
      elem: { tag: 'div', elem: { width: 'width' } },
      children: [{ isTextComponent: true, text: 'text' }],
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
