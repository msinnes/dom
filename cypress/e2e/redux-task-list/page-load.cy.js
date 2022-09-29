describe('page load', () => {
  it('the page should load', () => {
    cy.visit('http://localhost:9005');
  });

  it('should have a div with the correct message', () => {
    cy.get('body >').should(elems => {
      const div = elems.eq(1)[0];
      expect(div.tagName).to.equal('DIV');
      expect(div).to.contain('No Items Yet');
    });
  });

  it('should have a button to add items', () => {
    cy.get('body >').should(elems => {
      const button = elems.eq(2)[0];
      expect(button.tagName).to.equal('BUTTON');
      expect(button).to.contain('Add Item');
    });
  });
});