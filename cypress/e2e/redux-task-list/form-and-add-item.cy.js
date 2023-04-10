describe('form and add item', () => {
  it('the page should load', () => {
    cy.visit('http://localhost:9005');
  });

  it('should load the add item form', () => {
    cy.get('body > button').click();
  });

  it('should add text to the input', () => {
    cy.get('body > input').type('item 1', { delay: 25 });
    cy.get('body > input').should('have.value', 'item 1');
  });

  it('should add the item to the list', () => {
    cy.get('body > div > button').eq(0).click();
    cy.get('body >').should(elems => {
      const div = elems.eq(0)[0];
      expect(div.tagName).to.equal('DIV');
    });
    cy.get('body > div >').should(elems => {
      expect(elems.length).to.equal(1);
      const ul = elems.eq(0)[0];
      expect(ul.tagName).to.equal('UL');
    });
    cy.get('body > div > ul > li').should(listItems => {
      expect(listItems.length).to.equal(1);
    });
    cy.get('body > div > ul > li >').should(elems => {
      const span = elems.eq(0)[0];
      expect(span.tagName).to.equal('SPAN');
      expect(span).to.contain('item 1');
      const completeButton = elems.eq(1)[0];
      expect(completeButton.tagName).to.equal('BUTTON');
      expect(completeButton).to.contain('Complete');
      const deleteButton = elems.eq(2)[0];
      expect(deleteButton.tagName).to.equal('BUTTON');
      expect(deleteButton).to.contain('Delete');
    });
  });
});