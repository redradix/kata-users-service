# kata-users-service

## Start environment

```
docker-compose up users-service
```

## Run tests

```
docker-compose exec users-service bash
npm run test
```

## Use sample endpoints

Import [this collection](./UsersService.postman_collection.json) in Postman.


## Inspect db

```
docker-compose exec db bash
mongo
use production
db.samples.find()
```

## Requirements

The idea is to implement this features doint TDD.
Also to organize the code the best you can (SRP), but keeping it simple and clean.
Try to avoid premature abstractions and "cleveradas".

### Create user

  - Implement POST /users
  - A user will have a username, email, password.
  - Usernames cannot be repeated. Error message `username already in use`.
  - Email must have a valid format. Error message `email not valid`.
  - Password must have a minimun length of 8 characters. Error message `password must have 8 or more characters`.
  - Response will have status 200 if everything is ok. Also a json response `{ message: 'user created', id: 'the_user_id' }`.
  - If some validations fail, response will have status 400. Also a json response `{ errors: ['error1', 'error2' ] }`.

### List users

  - Implement GET /users
  - Response will have a status 200 and the list of users `{ users: [ { ...user1 }, { ...user2 } ] }`.
  - Passwords must not be sent.

### Filter users by username

  - Implement GET /users?q=whatever
  - Response will have a status 200.
  - It will contain the list of users that contains `whatever` in their username.
  - Passwords must not be sent.
