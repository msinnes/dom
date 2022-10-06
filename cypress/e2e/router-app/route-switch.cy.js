describe('route switch', () => {
  describe('about page', () => {
    it('should load the page', () => {
      cy.visit('http://localhost:9006');
    });

    it('should navigate to the About page', () => {
      cy.get('body > div > ul > li').eq(1).click();

      cy.get('body').should('contain', 'About Page');
      cy.location().should(loc => {
        expect(loc.pathname).to.equal('/about');
      });
    });
  });

  describe('params route', () => {
    it('should load the page', () => {
      cy.visit('http://localhost:9006');
    });

    it('should navigate to the Params page', () => {
      cy.get('body > div > ul > li').eq(2).click();

      cy.get('body').should('contain', 'Param: 1');
      cy.location().should(loc => {
        expect(loc.pathname).to.equal('/param/1');
      });
    });
  });

  describe('anything redirect', () => {
    it('should load the page', () => {
      cy.visit('http://localhost:9006');
    });

    it('should redirect to the About page', () => {
      cy.get('body > div > ul > li').eq(3).click();

      cy.get('body').should('contain', 'About Page');
      cy.location().should(loc => {
        expect(loc.pathname).to.equal('/about');
      });
    });
  });

  describe('back to home', () => {
    it('should load the page about page', () => {
      cy.visit('http://localhost:9006/about');

      cy.get('body').should('contain', 'About Page');
      cy.location().should(loc => {
        expect(loc.pathname).to.equal('/about');
      });
    });

    it('should navigate to the Home page', () => {
      cy.get('body > div > ul > li').eq(0).click();

      cy.get('body').should('contain', 'Home Page');
      cy.location().should(loc => {
        expect(loc.pathname).to.equal('/');
      });
    });
  });
});