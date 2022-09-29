describe('page load', () => {
  it('the page should load', () => {
    cy.visit('http://localhost:9000');
  });

  it('should have 2 divs on the page', () => {
    cy.get('body >').should(elems => {
      const div1 = elems.eq(1)[0];
      expect(div1.tagName).to.equal('DIV');
      const div2 = elems.eq(2)[0];
      expect(div2.tagName).to.equal('DIV');
    });
  });

  it('should have a div with a login link', () => {
    cy.get('body > div').should(divs => {
      const div1 = divs.eq(0)[0];
      const anchor = div1.firstChild;
      expect(anchor.tagName).to.equal('A');
      expect(anchor).to.contain('Login');
    });
  });

  it('should be on the home page', () => {
    cy.get('body > div').should(divs => {
      const div2 = divs.eq(1)[0];
      expect(div2).to.contain('Home Page');
    });
  });
});