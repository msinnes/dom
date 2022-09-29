describe('add item and complete', () => {
  it('the page should load', () => {
    cy.visit('http://localhost:9005');
  });

  it('should add an item', () => {
    cy.get('body > button').click();
    cy.get('body > input').type('item 1', { delay: 25 });
    cy.wait(25);
    cy.get('body > div > button').eq(0).click();
    cy.get('body > div > ul > li > button').should(buttons => {
      expect(buttons.eq(0)).to.contain('Complete');
      expect(buttons.eq(1)).to.contain('Delete');
    });
  });

  it('should complete the item', () => {
    cy.get('body > div > ul > li > button').eq(0).click();
    cy.get('body > div > ul > li > span').should(spans => {
      expect(spans.length).to.equal(1);
      expect(spans.eq(0)[0].innerHTML).to.equal('<del>item 1</del>');
    });
  });
});