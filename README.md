# IDOR Chat

This purpose of this project is to be a simple, easily deployable, insecure web application that could be used for application security training.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

## Live [Demo](https://idor-chat.herokuapp.com/)

Feel free to utilize the demo application.  Just know that the application will reset every hour.

### Prerequisites

Make sure you have [Node.js](http://nodejs.org/) and a [Typeorm](https://typeorm.io/#/) compatible database configured.

### Installing

```
npm install
```
Run in development mode:
```
npm run start:dev
```
Run in production mode:
```
npm build
npm start
```
Create a `.env` file with the following properties:
```
DB_HOST=
DB_USER=
DB_PASS=
DB_PORT=
DB_NAME=
JWT_KEY=
```
## Built With
* [Typeorm](https://typeorm.io/#/) - The ORM used
* [Angular](https://angular.io/) - The Angular Framework
* [Express](https://expressjs.com/) - A minimal and flexible Node.js web application framework 
## License
This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/Whamo12/idor-chat/blob/master/LICENSE) file for details
