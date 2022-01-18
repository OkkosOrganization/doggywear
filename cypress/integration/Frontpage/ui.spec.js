describe('Doggy Wear website', () => {
  beforeEach(() => {
    cy.visit('')
  })

  it('shows cart when cart icon is clicked on', () => {
    cy.get('[data-cy=cartBtn]').then(($el) => {
      $el.click();
      cy.get('#__next').should('have.class', 'cartOpen');
    })
  });
  
  it('shows navigation when menu icon is clicked on', () => {
    expect(cy.get('#__next').should('not.have.class', 'naviOpen'))
    cy.get('[data-cy=naviBtn]').then(($el) => {
      $el.click();
      cy.get('#__next').should('have.class', 'naviOpen');
    });
  });

  it('creates a new checkout and saves the id in localstorage', () => {
    expect(localStorage.getItem('checkoutId')).to.equal(null);
    cy.wait(2000).then(() => {
      expect(localStorage.getItem('checkoutId')).to.not.equal(null);
    });
  }); 
  
  it('can navigate to a product page and add a product to cart', () => {
    cy.get('[data-cy=productBtn]')
    .first()
    .click()
    .invoke('attr','href')
    .then(href => {    
      cy.location('pathname').should('eq', href);
      cy.get('[data-cy=addToCartBtn]', {timeout:6000}).click().then(() => {
        cy.get('#__next').should('have.class', 'cartOpen');
        cy.wait(2000);
        cy.get('[data-cy=cartBtn] span').contains('1');
      });
    })
  });  
});
