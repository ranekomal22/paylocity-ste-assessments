Feature: As an Employer, I want to add my employee data so that I can see calculated benefit costs

    Background:
        Given I am on Benefits Dashboard login page
        Then I enter my credentials and click the Login button
    
    @Add
    Scenario Outline: Add Employee
        When I am on the Benefits Dashboard page
        And I select Add Employee
        Then I should be able to enter employee details
            | firstName | lastName | dependents   |
            | <fName>   | <lName>  | <dependents> |           
        And the employee should save                 
        And the benefit cost calculations are correct
            | firstName | lastName | dependents   |
            | <fName>   | <lName>  | <dependents> | 
        And I should see "<fName>" "<lName>" Employee in the table

    Examples: 
        | fName | lName | dependents |
        | Komal | Rane  | 32         |
        | Bryan | Adams | 3          |       

    @Edit
    Scenario Outline: Edit Employee     
        When I am on the Benefits Dashboard page
        And I select the Action Edit
        Then I can edit employee details
            | firstName | lastName | dependents   |
            | <fName>   | <lName>  | <dependents> | 
        And The data should change in the table
            | firstName | lastName | dependents   |
            | <fName>   | <lName>  | <dependents> | 
    
    Examples: 
        | fName | lName | dependents |
        | Tony  | Stark | 4          |

    @Delete
    Scenario: Delete Employee
        When I am on the Benefits Dashboard page
        And I click the Action X
        Then The employee should be deleted