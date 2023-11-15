#### 1.0.0 (2023-11-15)

##### New Features

- added reset password endpoint (bb8894af)
- added reset password endpoint (f75bd712)
- added login endpoint and protected middleware (b1d91d98)
- added login for users with jwt (922ede23)
- added bcrypt library (3dba8098)
- added password hashing (64f3751d)
- added user model (1e3d33fa)
- added uncaught exception at the top of server.js (a41c93c5)
- added unhandled rejection globally (db10033e)
- added customer validation error message (9c09fdbf)
- added custom error messages for differente type of errors (2ffc4981)
- added mongo middlewares (031301d0)
- added endpoints that uses mongodb aggregation pipelines (ad002da4)
- add pagination on get all movies endpoint (4538c832)
- added query string functionality to get all movies endpoint (52e23630)
- added middleware to validare request body has data (956e37e7)
- mounting routes (2c516b76)
- add morgan and custom miiddleware (1917a6d1)
- add delete endpoint (b4216bf9)
- add patch endpoint (5e6a6528)
- add get/id endpoint to get one movie (0423b203)
- add post endpoint (5a7a94f6)
- add get endpoint to retrieve data from json (95dadcfe)

##### Bug Fixes

- change "bearer" to "Bearer" (f786ba15)
- filter has a bug when chaining other methods from ApiFeatures (e51a434b)
- bug on delete endpoint (8f0ee4db)

##### Other Changes

- added mongodb, and deleted all endpoint logic using json file data (93d98b5e)
- readme.md (357d1944)

##### Refactors

- added constant js file (dbf59a56)
- created asyncErrorHandler.js (1be4d04b)
- global error handler (e41c08a8)
- global error handler middleware (64ad2b5b)
- create utils class to sort, filter, limit fields and paginate (dc3aef25)
- on import_dev_data.js, added npm commands as shortcuts in package.json (79f2a877)
- endpoints and movies schema (63b51752)
- endpoints (b70939dc)
- added env file and refactor code to use it (bc6455ca)
- create controllers folder and server.js (7de6492d)
- add routes (45f355b8)

##### Tests

- checking global error handler (a6e9dd87)
- added test script to load test data (c2c2b1e3)
