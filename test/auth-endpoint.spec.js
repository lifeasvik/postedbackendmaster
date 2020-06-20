const knex = require("knex");
const jwt = require("jsonwebtoken");
const app = require("../src/app");
const helpers = require("./test-helpers");
const config = require("../src/config");

describe("Auth Endpoints", function () {
  let db;
  const testUsers = helpers.makeUsersArray();
  const testUser = testUsers[0];
  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });
  after("disconnect from db", () => db.destroy());
<<<<<<< HEAD
  beforeEach("insert users", () => helpers.seedUsers(db, testUsers));
  afterEach("cleanup", () => helpers.cleanTables(db));
  describe(`POST /api/auth/login`, () => {
    // beforeEach("insert users", () => helpers.createTable(db, testUsers));
=======
  beforeEach("cleanup", () => helpers.seedUsers(db));
  afterEach("cleanup", () => helpers.cleanTables(db));
  describe(`POST /api/login`, () => {
    // beforeEach("insert users", () => helpers.seedUsers(db, testUsers));
>>>>>>> 2262f9bf7056a32f2808f75c7723d3e1d4dfe57a
    const requiredFields = ["user_name", "password"];
    requiredFields.forEach((field) => {
      const loginAttemptBody = {
        user_name: testUser.user_name,
        password: testUser.password,
      };
      it(`responds with 400 required error when '${field}' is missing`, () => {
        delete loginAttemptBody[field];
        return supertest(app)
          .post("/api/auth/login")
          .send(loginAttemptBody)
          .expect(400, {
            error: `Missing '${field}' in request body`,
          });
      });
    });
    it(`responds 400 'invalid user_name or password' when bad user_name`, () => {
      const userInvalidUser = { user_name: "user-not", password: "existy" };
      return supertest(app)
        .post("/api/auth/login")
        .send(userInvalidUser)
        .expect(400, { error: `Incorrect user_name or password` });
    });
    it(`responds 400 'invalid user_name or password' when bad password`, () => {
      const userInvalidPass = {
        user_name: testUser.user_name,
        password: "incorrect",
      };
      return supertest(app)
        .post("/api/auth/login")
        .send(userInvalidPass)
        .expect(400, { error: `Incorrect user_name or password` });
    });
    it(`responds 200 and JWT auth token using secret when valid credentials`, () => {
      const userValidCreds = {
        user_name: testUser.user_name,
        password: testUser.password,
      };
      /*
       return jwt.sign(payload, config.JWT_SECRET, {
      subject,
      expiresIn: config.JWT_EXPIRY,
      algorithm: "HS256",
    });
    */
      const expectedToken = jwt.sign(
        { user_id: testUser.id },
        config.JWT_SECRET,
        {
          subject: testUser.user_name,
          expiresIn: config.JWT_EXPIRY,
          algorithm: "HS256",
        }
      );
      return supertest(app)
        .post("/api/auth/login")
        .send(userValidCreds)
        .expect(200, {
          authToken: expectedToken,
        });
    });
  });
  describe(`POST /api/auth/refresh`, () => {
    beforeEach("insert users", () => helpers.seedUsers(db, testUsers));
  });

  // Auth Endpoint Happy Path
  context(`Happy path`, () => {
    it(`responds 201, serialized user, storing bcrypted password`, () => {
      const newUser = {
        user_name: testUsers[0].user_name,
        password: testUsers[0].password,
      };
      return supertest(app)
        .post("/api/auth/login")
        .send(newUser)
        .expect(200)
        .expect((res) => {
          expect(res.body).to.have.property("authToken");
        });
    });
  });
});
