describe('page load', () => {
  it('should load the page', () => {
    cy.visit('http://localhost:9006');
  });

  it('should have a nav bar', () => {
    cy.get('body > div > ul > li').should(list => {
      expect(list, 'four nav items').to.have.length(4);
    });
    cy.get('body > div > ul > li > a').should(anchors => {
      expect(anchors, 'four nav items').to.have.length(4);
      expect(anchors.eq(0)).to.contain('Home');
      expect(anchors.eq(0)[0].className).to.equal('active');
      expect(anchors.eq(1)).to.contain('About');
      expect(anchors.eq(1)[0].className).to.equal('');
      expect(anchors.eq(2)).to.contain('Params');
      expect(anchors.eq(2)[0].className).to.equal('');
      expect(anchors.eq(3)).to.contain('Anything');
      expect(anchors.eq(3)[0].className).to.equal('');
    });
  });

  it('should be on the home page', () => {
    cy.get('body').should('contain', 'Home Page');
  });
});