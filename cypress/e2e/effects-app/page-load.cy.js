describe('page load', () => {
  it('the page should load', () => {
    cy.visit('http://localhost:9001');
  });

  it('should have the default title', () => {
    cy.title().should('eq', 'default title');
  });

  it('should have a button', () => {
    cy.get('body >').should(elems => {
      const button = elems.eq(0)[0];
      expect(button.tagName).to.equal('BUTTON');
      expect(button).to.contain('Click Me');
    })
  });

  it('should be on page 1', () => {
    cy.get('body').should('contain', 'Page 1');
  });
});