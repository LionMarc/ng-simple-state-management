describe('My First Test', () => {
  it('Visits the initial project page', () => {
    cy.visit('/');
    cy.get('.ngssm-shell-header-title').contains('Demo Application');
  });
});
