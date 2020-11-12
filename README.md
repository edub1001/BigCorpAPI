[![Build Status](https://dev.azure.com/EduardoBack/BigCorpAPI/_apis/build/status/BigCorpAPI%20-%20CI%20-%20Production?branchName=main)](https://dev.azure.com/EduardoBack/BigCorpAPI/_build/latest?definitionId=2&branchName=main)
[![Website https://bigcorpapi.azurewebsites.net/](https://img.shields.io/website?url=https://bigcorpapi.azurewebsites.net/)](https://bigcorpapi.azurewebsites.net/)
![Coverage](https://img.shields.io/azure-devops/coverage/EduardoBack/BigCorpAPI/2/main)
![Testing](https://img.shields.io/azure-devops/tests/EduardoBack/BigCorpAPI/2/main)

# BigCorpAPI
API project to be evaluated by Glide

## Overview
Your task is to build a web app with a read-only JSON api for 3 resources,  employees , departments ,  offices , you can use any framework or language for building your app.

## How to do a quick start
### Install Packages

```
$ npm install
```

### Dev start (clean build + linting + live change monitoring)

```
$ npm start
```

## Some specifics

### Lint code analysis

```
$ npm run prebuild
```

### Build (+Linting)

```
$ npm run build
```

### Prod start (needs a build first, executed from packages.json in dist folder)

```
$ npm run prodstart
```

## Configuration
### Changing default port
By default port will be 3000. It can be modified by setting environment variable PORT

```
$ export PORT=1234
PS $env:PORT=1234
cmd set PORT=1234
```
For other configurations such as external services URL (employeesUrl), you can change them from config folder according to node-config-ts package: https://www.npmjs.com/package/node-config-ts

## Testing
### Run unit + integration tests

```
$ npm test
```

### Run unit tests

```
$ npm run testunit
```

### Run coverage for unit + integration tests

```
$ npm run coverage
```

### Run coverage for unit tests

```
$ npm run coverageunit
```

## API
Your app should support GET requests to two endpoints (list & detail) for each resource following a standard REST convention
### detail  
- /employees/1 
### list 
- /employees <br/>
(list should support query  limit  and  offset  to support pagination. limit  is the max number of records returned, and  offset  is the index at which to start. for instance  /employees?limit=10&offset=17  returns the 18th through 27th employee By default,  limit  is 100 and the max  limit  is 1000.)

In addition, both methods should support a query parameter called  expand  that lets you expand data along paths of to-one relationships
There are four relationships that can be expanded,
manager  in  employees  (expands to  employees ) office  in  employees  (expands to  offices ) department  in  employees  (expands to  departments ) superdepartment  in  departments  (expands to  departments )

## Data Sources
The data source for  employees  is the api: https://rfy56yfcwk.execute-api.us-west-1.amazonaws.com/bigcorp/employees
it supports two ways of querying, with limit in offset:
https://rfy56yfcwk.execute-api.us-west-1.amazonaws.com/bigcorp/employees?limit=10&offset=20  (gets 21th through 31st record) 
or querying multiple ids 
https://rfy56yfcwk.execute-api.us-west-1.amazonaws.com/bigcorp/employees?id=3&id=4&id=5  (returns records with id=3, id=4, id=5) 
The data source for  offices  and  departments  are the files offices.json, departments.json. These are the entire list of offices and departments, and you can just read all the data for each and keep it in memory in your app.
