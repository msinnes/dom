const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed mollis mollis mi ut ultricies. Nullam magna ipsum, porta vel dui convallis, rutrum imperdiet eros. Aliquam erat volutpat.';

describe('page load', () => {
  it('should load the page', () => {
    cy.visit('http://localhost:9007');
  });

  it('should render three svg children', () => {
    cy.get('body > svg >').should(list => {
      expect(list, 'three svg items').to.have.length(3);
    });
  });

  it('should render the lorem ipsum text', () => {
    cy.get('body').should('contain', text);
  });
});