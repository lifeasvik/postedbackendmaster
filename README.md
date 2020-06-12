# Posted

An online postcard generator that allows users to create postcards using a URL link and text of their choice.

## Recommended Usage

For testing purposes, I recommend you experience this web app with the following login credentials -

- Username: Demo1
- Password: Password123!

## Screenshots

<p align="center">
  <img width="223" height="395.5" src="assets\landingpage.PNG">
  <img width="223" height="395.5" src="assets\signuppage.PNG">
  <img width="223" height="395.5" src="assets\dashboard.PNG">
</p>

## API Documentation

API endpoints

- POST to '/api/auth/login' authenticate and login returning user
- POST to '/api/auth/refresh' refresh Auth token
- POST to '/api/users' posts new user info into database
- GET to '/api/users' get all users from database
- GET to '/api/user/:id' get all stories by id
- GET to '/api/postcard' get all posts from database
- POST to '/api/postcard' posts a post to the database
- GET to '/api/postcard/:id' get all posts by id

## Built With

- HTML5
- CSS3
- Javascript
- jQuery
- React
- PostgreSQL
- Express
- Node.js
- JWT
- Heroku/Zeit

## Demo

- [Live Demo](https://react-posted.now.sh/)

## Author

- [**Vik Birdi**](https://github.com/lifeasvik) - Front-End development / Back-End development / Styling
