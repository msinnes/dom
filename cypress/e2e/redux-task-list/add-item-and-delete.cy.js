describe('add item and delete', () => {
  it('the page should load', () => {
    cy.visit('http://localhost:9005');
  });

  it('should add an item', () => {
    cy.get('body > button').click();
    cy.get('body > input').type('item 1');
    cy.get('body > div > button').eq(0).click();
    cy.get('body > div > ul > li > button').should(buttons => {
      expect(buttons.eq(0)).to.contain('Complete');
      expect(buttons.eq(1)).to.contain('Delete');
    });
  });

  it('should delete the item', () => {
    cy.get('body > div > ul > li > button').eq(1).click();
    cy.get('body >').should(elems => {
      const div = elems.eq(0)[0];
      expect(div.tagName).to.equal('DIV');
      expect(div).to.contain('No Items Yet');
    });
  });
});