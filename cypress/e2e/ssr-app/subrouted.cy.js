describe('subrouted -- index', () => {
  it('the page should load', () => {
    cy.visit('http://localhost:8080/subrouted');
  });

  it('should have text in the body\'s div', () => {
    cy.get('body > div').should('contain', 'Home');
  });

  it('should have links on the screen', () => {
    cy.get('body > ul > li > a').should(links => {
      expect(links.eq(0)).to.contain('Home');
      expect(links.eq(1)).to.contain('About');
      expect(links.eq(2)).to.contain('Params');
      expect(links.eq(3)).to.contain('Anything');
      expect(links.eq(4)).to.contain('Exit');
    });
  });
});

describe('subrouted -- about', () => {
  it('the page should load', () => {
    cy.visit('http://localhost:8080/subrouted/about');
  });

  it('should have text in the body\'s div', () => {
    cy.get('body > div').should('contain', 'About');
  });

  it('should have links on the screen', () => {
    cy.get('body > ul > li > a').should(links => {
      expect(links.eq(0)).to.contain('Home');
      expect(links.eq(1)).to.contain('About');
      expect(links.eq(2)).to.contain('Params');
      expect(links.eq(3)).to.contain('Anything');
      expect(links.eq(4)).to.contain('Exit');
    });
  });
});

describe('subrouted -- params', () => {
  it('the page should load', () => {
    cy.visit('http://localhost:8080/subrouted/param/1');
  });

  it('should have text in the body\'s div', () => {
    cy.get('body > div').should('contain', 'Param: 1');
  });

  it('should have links on the screen', () => {
    cy.get('body > ul > li > a').should(links => {
      expect(links.eq(0)).to.contain('Home');
      expect(links.eq(1)).to.contain('About');
      expect(links.eq(2)).to.contain('Params');
      expect(links.eq(3)).to.contain('Anything');
      expect(links.eq(4)).to.contain('Exit');
    });
  });
});

describe('subrouted -- navigation', () => {
  it('the page should load', () => {
    cy.visit('http://localhost:8080/subrouted');
  });

  it('should navigate to about', () => {
    cy.get('body > ul > li > a').eq(1).click();
    cy.get('body > div').should('contain', 'About');
  });

  it('should navigate back to home', () => {
    cy.get('body > ul > li > a').eq(0).click();
    cy.get('body > div').should('contain', 'Home');
  });

  it('should navigate away if a link external to the base route is clicked', () => {
    cy.get('body > ul > li > a').eq(4).click();
    cy.get('body').should('contain', 'Index');
    cy.location().should(loc => {
      expect(loc.pathname).to.equal('/');
    });
  });
});
