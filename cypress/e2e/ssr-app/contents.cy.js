describe('contents', () => {
  it('the page should load', () => {
    cy.visit('http://localhost:8080/contents');
  });

  it('should have text in the body', () => {
    cy.get('body').should('contain', 'Contents');
  });
});