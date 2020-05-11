module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET || "bananas",
  JWT_EXPIRY: process.env.JWT_EXPIRY || 3000000,
};
// TODO
// heroku create
// add the db
// npm run migrate:production
// go to dashboard.herokuapp.com -> setup JWT_SECRET and JWT_EXPIRY as config vars
