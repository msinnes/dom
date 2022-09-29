import * as auth from '../../fixtures/auth.json';

describe('form login and logout', () => {
  it('the page should load', () => {
    cy.visit('http://localhost:9000');
  });

  it('should load the auth form', () => {
    cy.get('body > div > a').click();
  });

  it('should perform a login action', () => {
    cy.get('body > div > form > div > input[name="username"]').type(auth.george.username, { delay: 25 });
    cy.get('body > div > form > div > input[name="password"]').type(auth.george.password, { delay: 25 });
    cy.get('body > div > form > div > button').click();
    cy.get('body > div > div').eq(0).should('have.text', `Welcome back ${auth.george.username}`);
  });

  it('should perform a log out action', () => {
    cy.get('body > div > div > button').click();
    cy.get('body > div').should(divs => {
      const div1 = divs.eq(0)[0];
      const anchor = div1.firstChild;
      expect(anchor.tagName).to.equal('A');
      expect(anchor).to.contain('Login');
      const div2 = divs.eq(1)[0];
      expect(div2).to.contain('Home Page');
    });
  });
});