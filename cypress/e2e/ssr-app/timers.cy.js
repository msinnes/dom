describe('redux', () => {
  it('the page should load', () => {
    cy.visit('http://localhost:8080/timers');
  });

  it('should have text in the body', () => {
    cy.get('body > div > p').should(paras => {
      expect(paras.eq(0)).to.contain('setTimeout async text');
      expect(paras.eq(1)).to.contain('setInterval async text');
    });
  });
});