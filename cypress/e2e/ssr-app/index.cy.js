describe('index', () => {
  it('the page should load', () => {
    cy.visit('http://localhost:8080');
  });

  it('should have text in the body', () => {
    cy.get('body').should('contain', 'Index');
  });
});
