const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const postcardsRouter = require("./postcards/postcards-router");
// const commentsRouter = require("./comments/comments-router");
const authRouter = require("./auth/auth-router");
const usersRouter = require("./users/users-router");

const app = express();

app.use(
  morgan(NODE_ENV === "production" ? "tiny" : "common", {
    skip: () => NODE_ENV === "test",
  })
);

app.use(cors());
app.use(helmet());

//Backend Endpoints

app.use("/api/postcards", postcardsRouter);
// app.use("/api/comments", commentsRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

//Function to handle server error response

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: "Server error" };
  } else {
    response = { error: error.message, object: error };
  }
  console.error(error);
  res.status(500).json(response);
});

module.exports = app;
