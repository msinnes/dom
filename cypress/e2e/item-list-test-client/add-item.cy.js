describe('add item', () => {
  it('the page should load', () => {
    cy.visit('http://localhost:9004');
  });

  it('should switch to the input page', () => {
    cy.get('body > button').click();

    cy.get('body >').should(elems => {
      const div = elems.eq(0)[0];
      expect(div.tagName).to.equal('DIV');
      expect(div).to.contain('Item List');
      const input = elems.eq(1)[0];
      expect(input.tagName).to.equal('INPUT');
      expect(input.type).to.equal('text');
      const button = elems.eq(2)[0];
      expect(button.tagName).to.equal('BUTTON');
      expect(button).to.contain('Add item');
    });
  });

  it('should type in the input box', () => {
    cy.get('body > input').type('input');

    cy.get('body > input').should('have.value', 'input');
  });

  it('should add the item to the list', () => {
    cy.get('body > button').click();

    cy.get('body >').should(elems => {
      const div = elems.eq(0)[0];
      expect(div.tagName).to.equal('DIV');
      expect(div).to.contain('Item List');
      const ul = elems.eq(1)[0];
      expect(ul.tagName).to.equal('UL');
      expect(ul.children.length).to.equal(1);
      expect(ul.firstChild).to.contain('input');
      const button = elems.eq(2)[0];
      expect(button.tagName).to.equal('BUTTON');
      expect(button).to.contain('Add Item');
    });
  });

  it('should switch to the input page again', () => {
    cy.get('body > button').click();

    cy.get('body >').should(elems => {
      const div = elems.eq(0)[0];
      expect(div.tagName).to.equal('DIV');
      expect(div).to.contain('Item List');
      const ul = elems.eq(1)[0];
      expect(ul.tagName).to.equal('UL');
      expect(ul.children.length).to.equal(1);
      expect(ul.firstChild).to.contain('input');
      const input = elems.eq(2)[0];
      expect(input.tagName).to.equal('INPUT');
      expect(input.type).to.equal('text');
      const button = elems.eq(3)[0];
      expect(button.tagName).to.equal('BUTTON');
      expect(button).to.contain('Add item');
    });
  });

  it('should type in the input box', () => {
    cy.get('body > input').type('input 2');

    cy.get('body > input').should('have.value', 'input 2');
  });

  it('should add the second item to the list', () => {
    cy.get('body > button').click();

    cy.get('body >').should(elems => {
      const div = elems.eq(0)[0];
      expect(div.tagName).to.equal('DIV');
      expect(div).to.contain('Item List');
      const ul = elems.eq(1)[0];
      expect(ul.tagName).to.equal('UL');
      expect(ul.children.length).to.equal(2);
      expect(ul.firstChild).to.contain('input');
      expect(ul.firstChild.nextSibling).to.contain('input 2');
      const button = elems.eq(2)[0];
      expect(button.tagName).to.equal('BUTTON');
      expect(button).to.contain('Add Item');
    });
  });
});