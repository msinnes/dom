import * as auth from '../../fixtures/auth.json';

describe('form and login', () => {
  it('the page should load', () => {
    cy.visit('http://localhost:9000');
  });

  it('should load the auth form', () => {
    cy.get('body > div > a').click();
  });

  it('should perform a login action', () => {
    cy.get('body > div > form > div > input[name="username"]').type(auth.mike.username, { delay: 25 });
    cy.get('body > div > form > div > input[name="password"]').type(auth.mike.password, { delay: 25 });
    cy.get('body > div > form > div > button').click();

    cy.get('body > div').should(divs => {
      const div1 = divs.eq(0)[0];
      expect(div1.tagName).to.equal('DIV');
      expect(div1.children.length).to.equal(2);
      expect(div1.children[0].tagName).to.equal('DIV');
      expect(div1.children[0]).to.contain(`Welcome back ${auth.mike.username}`);
      expect(div1.children[1].tagName).to.equal('DIV');
      expect(div1.children[1].firstChild.tagName).to.equal('BUTTON');
      expect(div1.children[1].firstChild).to.contain('Log Out');

      const div2 = divs.eq(1)[0];
      expect(div2.tagName).to.equal('DIV');
      expect(div2).to.contain('Home Page');
    });
  });
});