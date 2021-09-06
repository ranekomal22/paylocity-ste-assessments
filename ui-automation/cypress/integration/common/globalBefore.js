before(() => {
    // this will run once before all tests 
    // delete all existing employees here so that we will have a fresh environment for our tests
    const apiUri = Cypress.env('apiHostname') + Cypress.env('endpoint');
    const contentType = Cypress.env('contentType');
    const apiToken = 'Basic ' + Cypress.env('API_TOKEN');

    // ids array will contain all ids of Employees that are currently present in database
    let ids = [];
    
    // Make an API call to get all Employees
    cy.request({
        url: apiUri,
        headers: {
            "Content-Type": contentType,
            "Authorization": apiToken
        },
        method: "GET"
    }).should((response) => {
        
        // It should have status code 200 
        expect(response.status).to.equal(200)
        expect(response.body).to.be.not.undefined
        expect(response.body).to.be.not.null

        const arr = response.body;
        arr.forEach(element => {
            // Push all IDs in the ids array
            ids.push(element.id);
        });

        // Loop through ids array
        ids.forEach(id => {
            // Delete employee using the id
            cy.request({
                url: apiUri + '/' + id,
                headers: {
                    "Content-Type": contentType,
                    "Authorization": apiToken
                },
                method: "DELETE"
            }).should((response) => {
                expect(response.status).to.equal(200);
                cy.log('deleted ', id);
            })
        })
    })
});