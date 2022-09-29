describe('page load', () => {
  it('the page should load', () => {
    cy.visit('http://localhost:9002');
  });

  it('should have 5 divs on the page', () => {
    cy.get('body > div').should('have.length', 5);
  });

  it('should have a click button with a zero counter in the first div', () => {
    cy.get('body > div').should(divs => {
      const button = divs.eq(0)[0].firstChild;
      expect(button.tagName).to.equal('BUTTON');
      expect(button).to.contain('Click 0');
    });
  });

  it('should have a text input with the value text in the second div', () => {
    cy.get('body > div').should(divs => {
      const textInput = divs.eq(1)[0].firstChild;
      expect(textInput.tagName).to.equal('INPUT');
      expect(textInput.type).to.equal('text');
      expect(textInput.value).to.equal('text');
    });
  });

  it('should have a number input with the value 0 in the third div', () => {
    cy.get('body > div').should(divs => {
      const numberInput = divs.eq(2)[0].firstChild;
      expect(numberInput.tagName).to.equal('INPUT');
      expect(numberInput.type).to.equal('number');
      expect(numberInput.value).to.equal('0');
    });
  });

  it('should have two divs with the value text 0 in the fourth and fifth divs', () => {
    cy.get('body > div').should(divs => {
      const textDiv1 = divs.eq(3)[0];
      const textDiv2 = divs.eq(4)[0];
      expect(textDiv1.tagName).to.equal('DIV');
      expect(textDiv1).to.contain('text 0');
      expect(textDiv2.tagName).to.equal('DIV');
      expect(textDiv2).to.contain('text 0');
    });
  });
});