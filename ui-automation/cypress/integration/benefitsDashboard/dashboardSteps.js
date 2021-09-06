import { Given, When, Then, And } from "cypress-cucumber-preprocessor/steps";
import { salary, grossPay, primaryBenefitPerYear, dependentBenefitPerYear, paychecks } from '../../fixtures/dataFile.json'

// Id will be stored in this variable temporarily
// For simpler assertions
let userId;

Given(`I am on Benefits Dashboard login page`, () => {
    // Open Benefits Dashboard page and log in
    cy.visit('/');
    cy.viewport(1280, 800);
});

Then(`I enter my credentials and click the Login button`, () => {
    cy.login();
});

When(`I am on the Benefits Dashboard page`, () => {
    cy.url().should('include', '/Benefits');
    cy.get('a.navbar-brand').should('have.text', 'Paylocity Benefits Dashboard');
});

And(`I select Add Employee`, () => {
    // Click on Add employee button
    cy.get('#add').should('have.text', 'Add Employee').should('be.visible').click();
    
    // Verify that the modal pops up
    cy.get('#employeeModal').find('div.modal-content').should('be.visible');

    // Verify the elemets exist on the modal
    cy.get('#firstName').should('be.visible');
    cy.get('#lastName').should('be.visible');
    cy.get('#dependants').should('be.visible');
    cy.get('#addEmployee').should('have.text', 'Add').should('be.visible');
});

When(`I should be able to enter employee details`, (data) => {
    const userData = data.hashes()[0];
    cy.get('#firstName').type(userData.firstName);
    cy.get('#lastName').type(userData.lastName);
    cy.get('#dependants').type(userData.dependents);
});

And(`the employee should save`, () => {
    cy.get('#addEmployee').should('have.text', 'Add').click();
    cy.get('#employeeModal').find('div.modal-content',{ timeout: 10000 }).should('not.be.visible');
});

And(`I should see {string} {string} Employee in the table`, (fName, lName) => {
    cy.get('#employeesTable').find('tr').contains(fName).parent().within(() => {
        cy.get('td').eq(1, {timeout:0}).should('have.text',`${lName}`);
        cy.get('td').eq(2, {timeout:0}).should('have.text',`${fName}`);  
    });
});

And(`the benefit cost calculations are correct`, (data) => {
    const userData = data.hashes()[0];
    // Verify that benefits costs are saved correctly
    cy.xpath(`//table[@id="employeesTable"]//tr[contains(., "${userData.firstName}")]`).within(() => {
        cy.get('td').eq(3).should('have.text',`${userData.dependents}`);
        cy.get('td').eq(4).should('have.text',`${salary.toFixed(2)}`);
        cy.get('td').eq(5).should('have.text',`${grossPay.toFixed(2)}`);
        
        const benefitsCost = ((primaryBenefitPerYear / paychecks) + (dependentBenefitPerYear / paychecks * userData.dependents));
        cy.get('td').eq(6).should('have.text',`${benefitsCost.toFixed(2)}`);
        const netPay = (grossPay - benefitsCost);
        cy.get('td').eq(7).should('have.text',`${netPay.toFixed(2)}`);    
    });
});

And(`I select the Action Edit`, () => {
    // Store id in variable for future assertions
    cy.xpath('//tbody//tr//td').first().then(($entry) => {
        userId = $entry.text();
    })
    
    // Click on First Employee's Edit icon
    cy.get('i.fas.fa-edit').first().should('be.visible').click();
    
    // Verify that the modal pops up
    cy.get('#employeeModal').find('div.modal-content').should('be.visible');

    // Verify the elemets exist on the modal
    cy.get('#firstName').should('be.visible');
    cy.get('#lastName').should('be.visible');
    cy.get('#dependants').should('be.visible');
    cy.get('#updateEmployee').should('have.text', 'Update').should('be.visible');
});

Then(`I can edit employee details`, (data) => {
    const UpdateData = data.hashes()[0];
    
    cy.get('#employeeModal').find('div.modal-content').should('be.visible');
    
    // update details of employee
    cy.get('#firstName').clear().type(UpdateData.firstName);
    cy.get('#lastName').clear().type(UpdateData.lastName);
    cy.get('#dependants').clear().type(UpdateData.dependents);
    
    // Verify Update button text from Edit Modal and click it
    cy.get('#updateEmployee').should('have.text', 'Update').click();

    // Modal should disappear after click event
    cy.get('#employeeModal').find('div.modal-content').should('not.be.visible');
});

And(`The data should change in the table`, (data) => {
    const updateData = data.hashes()[0];
    
    // Find the table row using User Id and then perform assertions
    cy.xpath(`//table[@id="employeesTable"]//tr[contains(., "${updateData.firstName}")]`).within(() => {
        cy.get('td').eq(3).should('have.text',`${updateData.dependents}`);
        cy.get('td').eq(4).should('have.text',`${salary.toFixed(2)}`);
        cy.get('td').eq(5).should('have.text',`${grossPay.toFixed(2)}`);
        const benefitsCost = ((primaryBenefitPerYear/ paychecks) + (dependentBenefitPerYear / paychecks * updateData.dependents));
        cy.get('td').eq(6).should('have.text',`${benefitsCost.toFixed(2)}`);
        const netPay = (grossPay - benefitsCost);
        cy.get('td').eq(7).should('have.text',`${netPay.toFixed(2)}`);
        cy.get('td').eq(1, {timeout: 0}).should('have.text',`${updateData.lastName}`);
        cy.get('td').eq(2, {timeout: 0}).should('have.text',`${updateData.firstName}`);
    })       
});

And(`I click the Action X`, () => {
    let counter = 0;
    const clickDeleteIcon = () => {
        
        // Get the correct table row for user and click the X icon
        cy.xpath(`//table[@class="table table-striped"]//td[text()="${userId}"]`)
            .parent()
            .find('i.fa-times')
            .then( $element => {
                // If the element is properly attached in the DOM then perform click action
                if (Cypress.dom.isAttached($element)) {
                    $element.trigger('click');
                } else if (counter < 5) {
                    counter++;
                    clickDeleteIcon();
                } else {
                    // If element was not attached in DOM even after 5 tries then fail the step
                    assert.fail('Delete icon is not clickable');
                }
            })
    };

    clickDeleteIcon();

    // Delete Modal should be visible
    cy.get('#deleteModal').find('div.modal-content').should('be.visible');
});

Then(`The employee should be deleted`, () => {
    // Verify the delete button text and click the button
    cy.get('#deleteEmployee').should('have.text', 'Delete').click();
    
    // Modal should disappear after click event
    cy.get('#deleteModal').find('div.modal-content').should('not.be.visible');
    
    // Make sure that employee was removed from table
    cy.xpath(`//table[@class="table table-striped"]//td[text()="${userId}"]`).should('not.exist');
});
