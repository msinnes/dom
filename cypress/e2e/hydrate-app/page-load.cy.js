describe('page load', () => {
  it('the page should load', () => {
    cy.visit('http://localhost:9003');
  });

  it('should have text in the body', () => {
    cy.get('body').should('contain', 'text');
  });
});