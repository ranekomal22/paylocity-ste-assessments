# Summary of Defects
Some of APIs tests are failing for following existing defects in our backend -  

# Missing Requirements
For BenefitsCost and NetSalary fields, it is not clear that how many digits should be there after period (.)\
For this exercise I have considered the API example as a spec and written Assertions accordingly

### Defect 1
There is a discrepancy in the number of digits after period (.). It changes as per the number of dependents used in the requests.\
For example: If number of dependents is equal to 3 then Response has BenefitsCost has 7 digits after period and NetSalary has 5 digits after period. And this changes if we use different number of dependents in the API request\
Severity: Medium

### Defect 2:
BenefitsCost and NetSalary values are mathematically incorrect \
They are wrong after 5th digit from the period \
POST, PUT and GET Employee API Assertions are failing for those fields\
Severity: High

### Defect 3: 
When a PUT Employee API request is sent with an invalid ID in the body, it creates a new Entry with invalid data\
Severity: High

### Defect 4: 
Dependents field is spelled incorrectly\
Severity: Low

### Defect details can be found in [paylocity-ste-bug-challenge.pdf](https://github.com/ranekomal22/paylocity-ste-assessments/blob/main/paylocity-ste-bug-challenge.pdf)
