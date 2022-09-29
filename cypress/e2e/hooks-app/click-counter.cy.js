describe('click counter', () => {
  it('the page should load', () => {
    cy.visit('http://localhost:9002');
  });

  it('should increment the counter on click', () => {
    cy.get('body > div > button').click();
    cy.get('body > div > button').should('have.text', 'Click 1');
  });

  it('should continue incrementing the counter on click', () => {
    cy.get('body > div > button').click();
    cy.get('body > div > button').should('have.text', 'Click 2');
    cy.get('body > div > button').click();
    cy.get('body > div > button').should('have.text', 'Click 3');
  });
});