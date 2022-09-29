describe('form and cancel', () => {
  it('the page should load', () => {
    cy.visit('http://localhost:9005');
  });

  it('should load the add item form', () => {
    cy.get('body > button').click();
  });

  it('should cancel the input', () => {
    cy.get('body > div > button').eq(1).click();
    cy.get('body >').should(elems => {
      const div = elems.eq(1)[0];
      expect(div.tagName).to.equal('DIV');
      expect(div).to.contain('No Items Yet');
      const button = elems.eq(2)[0];
      expect(button.tagName).to.equal('BUTTON');
      expect(button).to.contain('Add Item');
    });
  });
});