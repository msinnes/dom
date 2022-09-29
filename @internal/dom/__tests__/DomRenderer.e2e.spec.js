/**
 * @jest-environment jsdom
 */
import { DomRenderer } from '../DomRenderer';

import { ArrayComponent, DomComponent, StringComponent } from '../DomComponent';
import { DomRef } from '../DomRef';

describe('e2e', () => {
  it('should render the root component', () => {
    const instance = new DomRenderer({ signature: 'div', props: {} });
    const rootElement = instance.root.elem.elem;
    expect(rootElement.tagName).toEqual('DIV');
  });

  it('should render a dom component', () => {
    const instance = new DomRenderer({ signature: 'div', props: {} });
    const rootElement = instance.root.elem.elem;
    instance.render({ signature: 'span', props: {} }, instance.root);
    expect(rootElement.children.length).toEqual(1);
    expect(rootElement.children[0].tagName).toEqual('SPAN');
  });

  it('should replace a dom component', () => {
    const instance = new DomRenderer({ signature: 'div', props: {} });
    const rootElement = instance.root.elem.elem;
    instance.render({ signature: 'span', props: {} }, instance.root);
    expect(rootElement.children.length).toEqual(1);
    expect(rootElement.children[0].tagName).toEqual('SPAN');
    const ref = new DomRef('p');
    instance.render({ signature: ref, props: {} }, instance.root, instance.root.firstChild);
    expect(rootElement.children.length).toEqual(1);
    expect(rootElement.children[0].tagName).toEqual('P');
  });

  it('should update a dom component', () => {
    const instance = new DomRenderer({ signature: 'div', props: {} });
    const rootElement = instance.root.elem.elem;
    instance.render({ signature: 'span', props: {} }, instance.root);
    expect(rootElement.children.length).toEqual(1);
    expect(rootElement.children[0].tagName).toEqual('SPAN');
    expect(rootElement.children[0].innerText).toBeUndefined();
    instance.render({ signature: 'span', props: { innerText: 'text' } }, instance.root, instance.root.firstChild);
    expect(rootElement.children.length).toEqual(1);
    expect(rootElement.children[0].tagName).toEqual('SPAN');
    expect(rootElement.children[0].innerText).toEqual('text');
  });

  it('should render component\'s descendents', () => {
    const instance = new DomRenderer({ signature: 'div', props: {} });
    const rootElement = instance.root.elem.elem;
    instance.render({ signature: 'div', props: {}, children: [
      { signature: 'div', props: {}, children: [
        { signature: 'span', props: { innerText: 'text 1' } },
      ]},
      { signature: 'div', props: {}, children: [
        { signature: 'span', props: { innerText: 'text 2' } },
      ]},
    ]}, instance.root);
    expect(rootElement.children.length).toEqual(1);
    expect(rootElement.firstChild.tagName).toEqual('DIV');
    expect(rootElement.firstChild.children.length).toEqual(2);
    expect(rootElement.firstChild.children[0].tagName).toEqual('DIV');
    expect(rootElement.firstChild.children[0].children.length).toEqual(1);
    expect(rootElement.firstChild.children[0].children[0].tagName).toEqual('SPAN');
    expect(rootElement.firstChild.children[0].children[0].innerText).toEqual('text 1');
    expect(rootElement.firstChild.children[1].tagName).toEqual('DIV');
    expect(rootElement.firstChild.children[1].children.length).toEqual(1);
    expect(rootElement.firstChild.children[1].children[0].tagName).toEqual('SPAN');
    expect(rootElement.firstChild.children[1].children[0].innerText).toEqual('text 2');
  });

  it('should update component\'s descendents', () => {
    const instance = new DomRenderer({ signature: 'div', props: {} });
    const rootElement = instance.root.elem.elem;
    instance.render({ signature: 'div', props: {}, children: [
      { signature: 'div', props: {}, children: [
        { signature: 'span', props: { innerText: 'text 1' } },
      ]},
      { signature: 'div', props: {}, children: [
        { signature: 'span', props: { innerText: 'text 2' } },
      ]},
    ]}, instance.root);
    expect(rootElement.children.length).toEqual(1);
    expect(rootElement.firstChild.tagName).toEqual('DIV');
    expect(rootElement.firstChild.children.length).toEqual(2);
    expect(rootElement.firstChild.children[0].tagName).toEqual('DIV');
    expect(rootElement.firstChild.children[0].children.length).toEqual(1);
    expect(rootElement.firstChild.children[0].children[0].tagName).toEqual('SPAN');
    expect(rootElement.firstChild.children[0].children[0].innerText).toEqual('text 1');
    expect(rootElement.firstChild.children[1].tagName).toEqual('DIV');
    expect(rootElement.firstChild.children[1].children.length).toEqual(1);
    expect(rootElement.firstChild.children[1].children[0].tagName).toEqual('SPAN');
    expect(rootElement.firstChild.children[1].children[0].innerText).toEqual('text 2');

    instance.render({ signature: 'div', props: {}, children: [
      { signature: 'div', props: {}, children: [
        { signature: 'p', props: { innerText: 'text 3' } },
      ]},
      { signature: 'div', props: {}, children: [
        { signature: 'p', props: { innerText: 'text 4' } },
      ]},
    ]}, instance.root, instance.root.firstChild);
    expect(rootElement.children.length).toEqual(1);
    expect(rootElement.firstChild.tagName).toEqual('DIV');
    expect(rootElement.firstChild.children.length).toEqual(2);
    expect(rootElement.firstChild.children[0].tagName).toEqual('DIV');
    expect(rootElement.firstChild.children[0].children.length).toEqual(1);
    expect(rootElement.firstChild.children[0].children[0].tagName).toEqual('P');
    expect(rootElement.firstChild.children[0].children[0].innerText).toEqual('text 3');
    expect(rootElement.firstChild.children[1].tagName).toEqual('DIV');
    expect(rootElement.firstChild.children[1].children.length).toEqual(1);
    expect(rootElement.firstChild.children[1].children[0].tagName).toEqual('P');
    expect(rootElement.firstChild.children[1].children[0].innerText).toEqual('text 4');
  });

  it('should remove component\'s unneeded descendents', () => {
    const instance = new DomRenderer({ signature: 'div', props: {} });
    const rootElement = instance.root.elem.elem;
    instance.render({ signature: 'div', props: {}, children: [
      { signature: 'div', props: {}, children: [
        { signature: 'span', props: { innerText: 'text 1' }},
      ]},
      { signature: 'div', props: {}, children: [
        { signature: 'span', props: { innerText: 'text 2' } },
      ]},
    ]}, instance.root);
    expect(rootElement.children.length).toEqual(1);
    expect(rootElement.firstChild.tagName).toEqual('DIV');
    expect(rootElement.firstChild.children.length).toEqual(2);
    expect(rootElement.firstChild.children[0].tagName).toEqual('DIV');
    expect(rootElement.firstChild.children[0].children.length).toEqual(1);
    expect(rootElement.firstChild.children[0].children[0].tagName).toEqual('SPAN');
    expect(rootElement.firstChild.children[0].children[0].innerText).toEqual('text 1');
    expect(rootElement.firstChild.children[1].tagName).toEqual('DIV');
    expect(rootElement.firstChild.children[1].children.length).toEqual(1);
    expect(rootElement.firstChild.children[1].children[0].tagName).toEqual('SPAN');
    expect(rootElement.firstChild.children[1].children[0].innerText).toEqual('text 2');

    instance.render({ signature: 'div', props: {}, children: [
      { signature: 'div', props: { innerText: 'text' } },
    ]}, instance.root, instance.root.firstChild);
    expect(rootElement.children.length).toEqual(1);
    expect(rootElement.firstChild.tagName).toEqual('DIV');
    expect(rootElement.firstChild.children.length).toEqual(1);
    expect(rootElement.firstChild.children[0].tagName).toEqual('DIV');
    expect(rootElement.firstChild.children[0].innerText).toEqual('text');
    expect(rootElement.firstChild.children[0].children.length).toEqual(0);
  });

  it('should render an array to the dom', () => {
    const instance = new DomRenderer({ signature: 'div', props: {} });
    const rootElement = instance.root.elem.elem;
    instance.render(['text'], instance.root);
    expect(rootElement.firstChild).toBeDefined();
    expect(rootElement.firstChild.wholeText).toEqual('text');
    instance.render(['new text', { signature: 'div', children: ['more text'] }], instance.root, instance.root.firstChild);
    expect(rootElement.firstChild.wholeText).toEqual('new text');
    expect(rootElement.firstChild.nextSibling.textContent).toEqual('more text');
  });

  it('should not render undefined to the dom', () => {
    const instance = new DomRenderer({ signature: 'div', props: {} });
    const rootElement = instance.root.elem.elem;
    instance.render([undefined], instance.root);
    expect(rootElement.firstChild).toBe(null);
  });

  it('should not render null to the dom', () => {
    const instance = new DomRenderer({ signature: 'div', props: {} });
    const rootElement = instance.root.elem.elem;
    instance.render([null], instance.root);
    expect(rootElement.firstChild).toBe(null);
  });

  it('should not render an empty string to the dom', () => {
    const instance = new DomRenderer({ signature: 'div', props: {} });
    const rootElement = instance.root.elem.elem;
    instance.render([''], instance.root);
    expect(rootElement.firstChild).toBe(null);
  });

  it('should not render an empty array to the dom', () => {
    const instance = new DomRenderer({ signature: 'div', props: {} });
    const rootElement = instance.root.elem.elem;
    instance.render([[]], instance.root);
    expect(rootElement.firstChild).toBe(null);
  });

  it('should update correctly', () => {
    while(document.body.firstChild) document.body.removeChild(document.body.firstChild);
    const render1 = [
      { signature: 'div', props: {}, children: [ 'Item List' ] },
      {
        signature: 'button',
        props: { onclick: () => {}, type: 'button' },
        children: [ 'Add Item' ]
      }
    ];
    const render2 = [
      { signature: 'div', props: {}, children: [ 'Item List' ] },
      [
        { signature: 'input', props: {}, children: [] },
        { signature: 'button', props: {}, children: ['Add Item'] }
      ]
    ];
    const instance = new DomRenderer({ signature: new DomRef(document.body) });
    instance.render(render1, instance.root);
    expect(document.body.innerHTML).toEqual('<div>Item List</div><button type="button">Add Item</button>');
    instance.render(render2, instance.root, instance.root.firstChild);
    expect(document.body.innerHTML).toEqual('<div>Item List</div><input><button>Add Item</button>');
  });

  it('should update arrays correctly', () => {
    while(document.body.firstChild) document.body.removeChild(document.body.firstChild);
    const render1 = [
      {
        signature: "div",
        props: {},
        children: [
          "Item List"
        ]
      },
      [
        {
          signature: "input",
          props: {
            type: "text",
            value: "mike"
          },
          children: []
        },
        {
          signature: "button",
          props: {
            type: "button"
          },
          children: [
            "Add Item"
          ]
        }
      ]
    ];
    const render2 = [
      {
        signature: "div",
        props: {},
        children: [
          "Item List"
        ]
      },
      {
        signature: "ul",
        props: {},
        children: [
          [
            {
              signature: "li",
              props: {},
              children: [
                "mike"
              ]
            }
          ]
        ]
      },
      {
        signature: "button",
        props: {
          type: "button"
        },
        children: [
          "Add Item"
        ]
      }
    ];
    const instance = new DomRenderer({ signature: new DomRef(document.body) });
    instance.render(render1, instance.root);
    expect(document.body.innerHTML).toEqual('<div>Item List</div><input type="text"><button type="button">Add Item</button>');
    instance.render(render2, instance.root, instance.root.firstChild);
    expect(document.body.innerHTML).toEqual('<div>Item List</div><ul><li>mike</li></ul><button type=\"button\">Add Item</button>');
  });
});
