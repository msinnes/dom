describe('form', () => {
  it('the page should load', () => {
    cy.visit('http://localhost:9000');
  });

  it('should load the auth form', () => {
    cy.get('body > div > a').click();
    cy.get('body > div >').should(elems => {
      expect(elems.length).to.equal(2);
      const header = elems.eq(0)[0];
      expect(header.tagName).to.equal('H2');
      expect(header).to.contain('Login');
      const form = elems.eq(1)[0];
      expect(form.tagName).to.equal('FORM');
    });
    cy.get('body > div > form >').should(elems => {
      expect(elems.length).to.equal(3);
      const div1 = elems.eq(0)[0];
      expect(div1.tagName).to.equal('DIV');
      expect(div1.children.length).to.equal(2);
      expect(div1.children[0].tagName).to.equal('LABEL');
      expect(div1.children[0].for).to.equal('username');
      expect(div1.children[0]).to.contain('Username');
      expect(div1.children[1].tagName).to.equal('INPUT');
      expect(div1.children[1].type).to.equal('text');
      expect(div1.children[1].name).to.equal('username');
      const div2 = elems.eq(1)[0];
      expect(div2.tagName).to.equal('DIV');
      expect(div2.children.length).to.equal(2);
      expect(div2.children[0].tagName).to.equal('LABEL');
      expect(div2.children[0].for).to.equal('password');
      expect(div2.children[0]).to.contain('Password');
      expect(div2.children[1].tagName).to.equal('INPUT');
      expect(div2.children[1].type).to.equal('password');
      expect(div2.children[1].name).to.equal('password');
      const div3 = elems.eq(2)[0];
      expect(div3.tagName).to.equal('DIV');
      expect(div3.children.length).to.equal(1);
      expect(div3.children[0].tagName).to.equal('BUTTON');
      expect(div3.children[0]).to.contain('Submit');
    });
  });
});