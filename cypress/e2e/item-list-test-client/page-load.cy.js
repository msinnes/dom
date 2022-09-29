describe('page load', () => {
  it('the page should load', () => {
    cy.visit('http://localhost:9004');
  });

  it('should have an Item List label', () => {
    cy.get('body > div').should('have.text', 'Item List');
  });

  it('should have an Add Item button', () => {
    cy.get('body > button').should('have.text', 'Add Item');
  });
});