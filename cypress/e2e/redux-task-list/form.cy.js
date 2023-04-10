describe('form', () => {
  it('the page should load', () => {
    cy.visit('http://localhost:9005');
  });

  it('should load the add item form', () => {
    cy.get('body > button').click();
    cy.get('body >').should(elems => {
      const input = elems.eq(0)[0];
      expect(input.tagName).to.equal('INPUT');
      expect(input.type).to.equal('text');
    });
    cy.get('body > div >').should(buttons => {
      expect(buttons.length).to.equal(2);
      const submitButton = buttons.eq(0)[0];
      const cancelButton = buttons.eq(1)[0];
      expect(submitButton.tagName).to.equal('BUTTON');
      expect(submitButton).to.contain('Submit');
      expect(cancelButton.tagName).to.equal('BUTTON');
      expect(cancelButton).to.contain('Close');
    });
  });
});