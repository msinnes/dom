describe('number input', () => {
  it('the page should load', () => {
    cy.visit('http://localhost:9002');
  });

  it('should track the text input text', () => {
    cy.get('body > div > input').eq(1).type('{backspace}1');
    cy.get('body > div').should(divs => {
      const textDiv1 = divs.eq(4)[0];
      const textDiv2 = divs.eq(5)[0];
      expect(textDiv1).to.contain('text 1');
      expect(textDiv2).to.contain('text 0');
    });
  });
});