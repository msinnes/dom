describe('redux', () => {
  it('the page should load', () => {
    cy.visit('http://localhost:8080/set-timeout');
  });

  it('should have text in the body', () => {
    cy.get('body').should('contain', 'async text');
  });
});