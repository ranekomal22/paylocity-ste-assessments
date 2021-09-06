import { Given, When, Then, And } from "cypress-cucumber-preprocessor/steps";
import { salary, grossPay, primaryBenefitPerYear, dependentBenefitPerYear, paychecks } from '../../fixtures/dataFile.json'
import BenefitsDashboardPage from '../../pages/benefitsDashboardPage';

const benefitsDashboardPage = new BenefitsDashboardPage();

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
    benefitsDashboardPage.getPageHeader().should('have.text', 'Paylocity Benefits Dashboard');
});

And(`I select Add Employee`, () => {
    // Click on Add employee button

    benefitsDashboardPage.getAddEmployeeButton().should('be.visible').click();
    
    // Verify that the modal pops up
    benefitsDashboardPage.getEmployeeModal().should('be.visible');

    // Verify the elemets exist on the modal
    benefitsDashboardPage.getFirstName().should('be.visible');
    benefitsDashboardPage.getLastName().should('be.visible');
    benefitsDashboardPage.getDependents().should('be.visible');
    benefitsDashboardPage.getAddButton().should('be.visible');
});

When(`I should be able to enter employee details`, (data) => {
    const userData = data.hashes()[0];
    benefitsDashboardPage.getFirstName().type(userData.firstName);
    benefitsDashboardPage.getLastName().type(userData.lastName);
    benefitsDashboardPage.getDependents().type(userData.dependents);
});

And(`the employee should save`, () => {
    benefitsDashboardPage.getAddButton().click();
    benefitsDashboardPage.getEmployeeModal().should('not.be.visible');
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
    benefitsDashboardPage.getEmployeeModal().should('be.visible');

    // Verify the elemets exist on the modal
    benefitsDashboardPage.getFirstName().should('be.visible');
    benefitsDashboardPage.getLastName().should('be.visible');
    benefitsDashboardPage.getDependents().should('be.visible');
    benefitsDashboardPage.getupdateButton().should('be.visible');
});

Then(`I can edit employee details`, (data) => {
    const UpdateData = data.hashes()[0];
    
    benefitsDashboardPage.getEmployeeModal().should('be.visible');
    
    // update details of employee
    benefitsDashboardPage.getFirstName().clear().type(UpdateData.firstName);
    benefitsDashboardPage.getLastName().clear().type(UpdateData.lastName);
    benefitsDashboardPage.getDependents().clear().type(UpdateData.dependents);
    
    // Verify Update button text from Edit Modal and click it
    benefitsDashboardPage.getupdateButton().click();

    // Modal should disappear after click event
    benefitsDashboardPage.getEmployeeModal().should('not.be.visible');
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
        benefitsDashboardPage.getEmployeeRecord(userId)
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
    benefitsDashboardPage.getDeleteModal().should('be.visible');
});

Then(`The employee should be deleted`, () => {
    // Verify the delete button text and click the button
    benefitsDashboardPage.getDeleteButton().click();
    
    // Modal should disappear after click event
    benefitsDashboardPage.getDeleteModal().should('not.be.visible');
    
    // Make sure that employee was removed from table
    benefitsDashboardPage.getEmployeeRecord(userId).should('not.exist');
});
