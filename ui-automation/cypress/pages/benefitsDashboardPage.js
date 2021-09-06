export default class PaylocityBenefitsDashboard {

    // Benefits Dashboard Page Selectors
    getPageHeader(){
        return cy.get('a.navbar-brand');
    }

    getAddEmployeeButton(){
        return cy.get('#add').should('have.text', 'Add Employee');
    }

    // Add/Edit Modal Selectors
    getFirstName(){
        return cy.get('#firstName');
    }
    getLastName(){
        return cy.get('#lastName');
    }
    getDependents(){
        return cy.get('#dependants');
    }

    //Add Employee Selectors
    getAddButton(){
        return cy.get('#addEmployee').should('have.text', 'Add');
    }

    getEmployeeModal(){
        return cy.get('#employeeModal').find('div.modal-content');
    }

    //Edit Employee Selectors
    getupdateButton(){
        return cy.get('#updateEmployee').should('have.text', 'Update');
    }

    //Delete Employee Selectors
    getDeleteModal(){
        return cy.get('#deleteModal').find('div.modal-content');
    }
    
    getDeleteButton(){
        return cy.get('#deleteEmployee').should('have.text', 'Delete');
    }

    getEmployeeRecord(userId){
        return cy.xpath(`//table[@class="table table-striped"]//td[text()="${userId}"]`)
    } 

}