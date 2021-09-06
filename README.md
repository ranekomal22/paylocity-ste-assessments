# Part 1: Bug Finding Challenge
Benefits Dashboard application API and UI defect file available here: [paylocity-ste-bug-challenge.pdf](paylocity-ste-bug-challenge.pdf)

# Part 2: Automation Challenge 

### Table of contents:
1. [Automation Challenge](#Automation-Challenge)
2. [API Testing Steps](#API-Testing-Steps)
3. [API Testing Results](#API-Testing-Results)
4. [UI Testing Steps](#UI-Testing-Steps)
5. [Run UI Tests](#Run-UI-Tests)

## Automation Challenge     

One of the critical functions that Paylocity provide to clients is the ability to pay for their employees’ benefits packages. A portion of these costs are deducted from their paycheck, and Paylocity handle that deduction. below challenges executed for the sample Benefits Dashboard application:\
• Using the API documentation provided, create and share at least one test for each API endpoint
with the tool of your choice (for example, create a Postman collection or a SOAP UI project)\
• Choose any test case and write UI automation for it with the tool of your choice (not click-andrecord)


## API Testing Steps
API automation testing is performed by using Postman Collection. 

Steps to execute the tests in Postman -
1. Open Postman App
2. Import Postman Environment [Environment](https://github.com/ranekomal22/paylocity-ste-assessments/blob/main/postman-artifacts/environments/testEnv.postman_environment.json)
3. Add API Auth token
4. Import Postman Collection [Collection](https://github.com/ranekomal22/paylocity-ste-assessments/blob/main/postman-artifacts/collections/EmployeeCRUDSpecs.postman_collection.json)
5. Click on Run Collection
6. Import Data File [Data File](https://github.com/ranekomal22/paylocity-ste-assessments/blob/main/postman-artifacts/datafiles/test_data.json)
7. Run the collection

## API Testing Results
<img width="893" alt="api-testing-results" src="https://user-images.githubusercontent.com/47266299/132166890-50e2c84e-eba0-426f-970a-7649cb7202e7.png">


## UI Testing Steps

UI automation testing is performed for below user story using Cypress Cucumber framework

###### User Story:
As an Employer, I want to input my employee data so that I can get a preview of benefit costs.\
Acceptance Criteria

Scenario 1: Add Employee

GIVEN an Employer\
AND I am on the Benefits Dashboard page\
WHEN I select Add Employee\
THEN I should be able to enter employee details\
AND the employee should save\
AND I should see the employee in the table\
AND the benefit cost calculations are correct\

Scenario 2: Edit Employee

GIVEN an Employer\
AND I am on the Benefits Dashboard page\
WHEN I select the Action Edit\
THEN I can edit employee details\
AND the data should change in the table

Scenario 3: Delete Employee

GIVEN an Employer\
AND I am on the Benefits Dashboard page\
WHEN I click the Action X\
THEN the employee should be deleted

###### Installation

All the dependencies are managed by npm.\
Install all required modules listed in the ./package.json file, run command: `npm install`\
This will enable the page to work on a local environment without having to grab the files from other sources.

## Run UI Tests
**NOTE: 
This automation framework deletes all existing Employees before starting UI tests so that the environment is always clean!!

To run the tests with cypress and Chrome browser, execute below steps:

```bash
export CYPRESS_USER=<paylocity_username>
export CYPRESS_PWD=<paylocity_password>
export CYPRESS_API_TOKEN=<API_TOKEN_HERE>

npm run cypress:open
```

To run the tests with cypress and headless browser, execute below steps:

```bash
export CYPRESS_USER=<paylocity_username>
export CYPRESS_PWD=<paylocity_password>
export CYPRESS_API_TOKEN=<API_TOKEN_HERE>

npm run test
```

## UI Automation Tests Results
#### Test Execution Video:
https://youtu.be/M_YX09kvik8

#### Test Execution Screenshots:
<img width="1048" alt="screen-1" src="https://user-images.githubusercontent.com/47266299/132253576-c4c95fc4-4897-4b13-9d54-fb58dd45d73c.png">
<img width="1058" alt="screen-2" src="https://user-images.githubusercontent.com/47266299/132253591-e6c9c5ff-f1d6-45bd-9834-12335a74c513.png">
