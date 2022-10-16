import { When, Then } from '@badeball/cypress-cucumber-preprocessor';

When('I visit the initial project page', () => {
  cy.visit('/');
});

Then('I should see the shell with the title {string}', (s: string) => {
  cy.get('.ngssm-shell-header-title').contains('Demo Application');
});
