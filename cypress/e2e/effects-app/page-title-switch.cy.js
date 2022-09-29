describe('page title switch', () => {
  it('the page should load', () => {
    cy.visit('http://localhost:9001');
  });

  it('should switch the title', () => {
    cy.get('body > button').click();

    cy.title().should('eq', 'set title');
  });

  it('should switch the title back', () => {
    cy.get('body > button').click();

    cy.title().should('eq', 'default title');
  });
});