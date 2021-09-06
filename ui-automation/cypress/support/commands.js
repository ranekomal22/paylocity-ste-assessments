import 'cypress-xpath';

// Login on Benefits Dashboard page
Cypress.Commands.add('login', () => {
    // verify we are on log in page
    cy.get('.navbar-brand').contains('Paylocity Benefits Dashboard').should('exist');

    const usernameKey = 'USER';
    const passwordKey = 'PWD';

    // Locate an email input field, type into it and verify that the value has been updated
    cy.get('#Username').type(Cypress.env(usernameKey));

    // Locate password input field
    // Read password from environment variable and type it in password field
    cy.get('#Password').type(Cypress.env(passwordKey));

    // Click on sign in button
    cy.get('.btn.btn-primary').contains('Log In').click();

    // verify new URL which includes '/Benefits'
    cy.url().should('include', '/Benefits');
});